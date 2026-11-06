/**
 * Script de Migração Automatizada para o Supabase / Neon
 * Executa schema.sql e seeds.sql diretamente no banco em nuvem
 */
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function runMigration(connectionString) {
  if (!connectionString) {
    console.error('ERRO: Informe a connection string do Supabase.');
    process.exit(1);
  }

  console.log('Conectando ao banco de dados Supabase em nuvem...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Conexao estabelecida com sucesso!');

    const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
    const seedsPath = path.resolve(__dirname, '../../../database/seeds.sql');

    console.log('Lendo schema.sql...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    console.log('Executando DDL (Tabelas, Enums, Triggers de Auditoria)...');
    await client.query(schemaSql);
    console.log('Schema criado com sucesso!');

    console.log('Lendo seeds.sql...');
    const seedsSql = fs.readFileSync(seedsPath, 'utf8');
    console.log('Executando carga inicial (Resolução CMN 5.272/2025, Ativos e Usuário Master)...');
    await client.query(seedsSql);
    console.log('Seeds aplicados com sucesso!');

    console.log('=====================================================');
    console.log('BANCO DE DADOS SUPABASE CONFIGURADO COM SUCESSO!');
    console.log('Usuario Master: prof.jan100@gmail.com');
    console.log('Senha Inicial: 123456');
    console.log('=====================================================');
  } catch (error) {
    console.error('Falha durante a migracao:', error);
  } finally {
    await client.end();
  }
}

const dbUrl = process.argv[2] || process.env.DATABASE_URL;
runMigration(dbUrl);
