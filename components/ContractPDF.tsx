"use client";

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Estilos do PDF (parecido com CSS)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  section: {
    marginBottom: 10,
    textAlign: 'justify',
  },
  bold: {
    fontFamily: 'Helvetica-Bold',
    fontWeight: 'bold', // Helvetica-Bold garante o negrito no PDF
  },
  signatureBox: {
    marginTop: 50,
    borderTopWidth: 1,
    borderTopColor: '#000',
    width: '60%',
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingTop: 5,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 10,
    textAlign: 'center',
    color: 'grey',
  }
});

interface ContractProps {
  studentName: string;
  cpf: string;
  address: string;
  course: string;
  value: string;
  matricula: string;
}

export const ContractPDF = ({ studentName, cpf, address, course, value, matricula }: ContractProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* TÍTULO */}
      <Text style={styles.header}>Contrato de Prestação de Serviços Educacionais</Text>
      
      {/* IDENTIFICAÇÃO */}
      <View style={styles.section}>
        <Text>
          Pelo presente instrumento particular, de um lado <Text style={styles.bold}>VULP EDUCATION LTDA</Text>, CNPJ 00.000.000/0001-00, doravante denominada <Text style={styles.bold}>CONTRATADA</Text>, e de outro lado:
        </Text>
      </View>

      <View style={{ marginVertical: 10, padding: 10, backgroundColor: '#f0f0f0' }}>
        <Text><Text style={styles.bold}>ALUNO(A):</Text> {studentName}</Text>
        <Text><Text style={styles.bold}>CPF:</Text> {cpf}</Text>
        <Text><Text style={styles.bold}>MATRÍCULA:</Text> {matricula}</Text>
        <Text><Text style={styles.bold}>ENDEREÇO:</Text> {address}</Text>
      </View>

      <Text style={styles.section}>
        Doravante denominado(a) <Text style={styles.bold}>CONTRATANTE</Text>, têm entre si justo e contratado o seguinte:
      </Text>

      {/* CLÁUSULAS */}
      <Text style={styles.section}>
        <Text style={styles.bold}>CLÁUSULA 1ª - DO OBJETO:</Text> O objeto deste contrato é a prestação de serviços educacionais referentes ao curso livre de <Text style={styles.bold}>{course}</Text>, na modalidade presencial.
      </Text>

      <Text style={styles.section}>
        <Text style={styles.bold}>CLÁUSULA 2ª - DO VALOR:</Text> Pelos serviços prestados, o CONTRATANTE pagará à CONTRATADA o valor total de <Text style={styles.bold}>R$ {value}</Text>, conforme plano de pagamento acordado.
      </Text>

      <Text style={styles.section}>
        <Text style={styles.bold}>CLÁUSULA 3ª - DAS OBRIGAÇÕES:</Text> A CONTRATADA compromete-se a fornecer toda a infraestrutura, material didático e mentoria necessários para o bom desenvolvimento do curso.
      </Text>

      <Text style={styles.section}>
        <Text style={styles.bold}>CLÁUSULA 4ª - DA FREQUÊNCIA:</Text> Para obtenção do certificado, é necessária a frequência mínima de 75% nas aulas presenciais e entrega dos projetos práticos.
      </Text>

      {/* ASSINATURAS */}
      <View style={{ marginTop: 80 }}>
        <View style={styles.signatureBox}>
            <Text>VULP EDUCATION LTDA</Text>
            <Text style={{ fontSize: 10 }}>CNPJ 00.000.000/0001-00</Text>
        </View>

        <View style={styles.signatureBox}>
            <Text>{studentName}</Text>
            <Text style={{ fontSize: 10 }}>CPF: {cpf}</Text>
        </View>
      </View>

      {/* RODAPÉ */}
      <Text style={styles.footer}>
        Contrato gerado eletronicamente em {new Date().toLocaleDateString()} pelo sistema VULP PLATFORM.
      </Text>

    </Page>
  </Document>
);