#!/usr/bin/env node

// Script pour vérifier que toutes les variables d'environnement sont définies
const requiredEnvVars = [
  'NEXT_PUBLIC_PROJECT_ID',
  'NEXT_PUBLIC_CONTRACT_ARTIST',
  'NEXT_PUBLIC_CONTRACT_ORGANIZATOR',
  'NEXT_PUBLIC_CONTRACT_TICKET',
  'NEXT_PUBLIC_CONTRACT_EVENT',
  'NEXT_PUBLIC_CONTRACT_EVENT_MANAGER',
  'NEXT_PUBLIC_CONTRACT_NAME'
];

console.log('🔍 Vérification des variables d\'environnement...\n');

let allPresent = true;

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: NON DÉFINIE`);
    allPresent = false;
  } else {
    console.log(`✅ ${varName}: ${value.substring(0, 20)}${value.length > 20 ? '...' : ''}`);
  }
});

console.log('\n' + '='.repeat(50));

if (allPresent) {
  console.log('🎉 Toutes les variables d\'environnement sont définies !');
  process.exit(0);
} else {
  console.log('💥 Certaines variables d\'environnement sont manquantes !');
  console.log('\n📋 Variables requises :');
  requiredEnvVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  process.exit(1);
}
