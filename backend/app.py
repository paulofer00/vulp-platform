# backend/app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import traceback
import requests # 🛑 NOVA BIBLIOTECA PARA FALAR COM O BANCO CENTRAL

# Bypass para o erro de SSL do Mac
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

app = FastAPI(title="Motor Financeiro VULP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SHEET_URL = "https://docs.google.com/spreadsheets/d/1OST5zwG7_1335nwLnI4IeKMQejgYNZZIVJKU_A5ewuw/export?format=xlsx"

CACHE_DADOS = {}

# 👇 NOVO MOTOR: ROBÔ DO BANCO CENTRAL DO BRASIL 👇
def obter_indices_mercado():
    if "indices" in CACHE_DADOS:
        return CACHE_DADOS["indices"]
    
    print("Buscando IPCA e IGP-M no Banco Central...")
    try:
        # IPCA (Código SGS 433) - Puxa os últimos 12 meses
        res_ipca = requests.get("https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json", timeout=5)
        fator_ipca = 1.0
        for item in res_ipca.json(): 
            fator_ipca *= (1 + float(item['valor']) / 100)
        ipca_acumulado = round((fator_ipca - 1) * 100, 2)

        # IGP-M (Código SGS 189) - Puxa os últimos 12 meses
        res_igpm = requests.get("https://api.bcb.gov.br/dados/serie/bcdata.sgs.189/dados/ultimos/12?formato=json", timeout=5)
        fator_igpm = 1.0
        for item in res_igpm.json(): 
            fator_igpm *= (1 + float(item['valor']) / 100)
        igpm_acumulado = round((fator_igpm - 1) * 100, 2)

        indices = {"ipca": ipca_acumulado, "igpm": igpm_acumulado}
        CACHE_DADOS["indices"] = indices
        return indices
    except Exception as e:
        print("Erro ao buscar no BCB:", e)
        # Se o Banco Central estiver fora do ar, usa um fallback de segurança
        return {"ipca": 3.91, "igpm": 4.00, "aviso": "Dados offline"}

def carregar_dados_planilha():
    if "projecao" in CACHE_DADOS:
        return CACHE_DADOS["projecao"], CACHE_DADOS.get("dash"), CACHE_DADOS.get("eve")

    print("Baixando dados do Google Sheets...")
    df_proj = pd.read_excel(SHEET_URL, sheet_name='Projeção')
    df_proj.columns = [f'col_{i}' for i in range(len(df_proj.columns))]
    
    try: 
        df_dash = pd.read_excel(SHEET_URL, sheet_name='Dashboard')
        df_dash.columns = [f'col_{i}' for i in range(len(df_dash.columns))]
    except: df_dash = None
        
    try: 
        df_eve = pd.read_excel(SHEET_URL, sheet_name='EVE sócio')
        df_eve.columns = [f'col_{i}' for i in range(len(df_eve.columns))]
    except: df_eve = None

    CACHE_DADOS["projecao"] = df_proj
    CACHE_DADOS["dash"] = df_dash
    CACHE_DADOS["eve"] = df_eve
    
    return df_proj, df_dash, df_eve

def obter_valores(df, palavra_chave, inicio=2, fim=7):
    mask = df['col_1'].astype(str).str.contains(palavra_chave, case=False, na=False)
    if mask.any(): 
        linha_dados = df[mask].iloc[0, inicio:fim]
        return pd.to_numeric(linha_dados, errors='coerce').fillna(0).tolist()
    return [0] * (fim - inicio)

@app.get("/api/dashboard")
def get_dashboard_data():
    try:
        df_projecao, df_dash, df_eve = carregar_dados_planilha()
        
        # 🛑 CHAMA O ROBÔ DO BCB 🛑
        indices_mercado = obter_indices_mercado()
        
        receita_alunos = obter_valores(df_projecao, 'Receita de alunos')
        receita_cowork = obter_valores(df_projecao, 'Receita de Cowork')
        receita_online = obter_valores(df_projecao, 'Receita online')
        receita_b2b = obter_valores(df_projecao, 'Empresas parceiras')

        periodos = [0, 1, 2, 3, 4, 5, 6, 7, 8]
        saldo = [-950000, -879765, -798181, -702047, -586214, -445968, -300113, -148423, 9334]
        if df_eve is not None:
            try:
                df_payback = df_eve.iloc[9:].copy()
                periodos = pd.to_numeric(df_payback['col_1'], errors='coerce').dropna().tolist()
                saldo = pd.to_numeric(df_payback['col_3'], errors='coerce').dropna().tolist()
            except: pass

        payload = {
            "status": "success",
            "indices": indices_mercado, # 🛑 INJETA OS ÍNDICES NO JSON 🛑
            "receitas": {
                "ano1": {
                    "Presencial": receita_alunos[0],
                    "Online": receita_online[0],
                    "B2B": receita_b2b[0],
                    "Coworking": receita_cowork[0]
                },
                "projecao_5_anos": {
                    "Presencial": receita_alunos,
                    "Online": receita_online,
                    "B2B": receita_b2b,
                    "Coworking": receita_cowork
                }
            },
            "capex_opex": {
                "orcado": 778800.34,
                "executado": 11894.38,
                "custo_fixo": 42305.60,
                "custo_var_presencial": 84.49
            },
            "valuation": {
                "estimado": 5598265.29,
                "capital_inicial": 950000.00,
                "roi": 1.94,
                "tir": 9.40
            },
            "payback": {
                "periodos": periodos,
                "saldo": saldo
            }
        }
        return payload

    except Exception as e:
        erro_detalhado = traceback.format_exc()
        print(erro_detalhado)
        return {"status": "error", "message": str(e), "detalhes": erro_detalhado}

@app.get("/api/refresh")
def force_refresh():
    CACHE_DADOS.clear()
    return {"message": "Cache limpo. O próximo carregamento baixará a planilha e os índices do BCB novamente!"}