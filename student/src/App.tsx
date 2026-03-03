import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { Dictionary } from './components/Dictionary';
import { WordOfDay } from './components/WordOfDay';
import { Quiz } from './components/Quiz';
import { sampleWords } from './data/words';

type Tab = 'wordOfDay' | 'dictionary' | 'quiz';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('wordOfDay');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🇧🇮 Learn Kirundi</Text>
        <Text style={styles.headerSubtitle}>Discover the beauty of the Burundian language</Text>
      </View>

      {/* Navigation Tabs */}
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={() => setActiveTab('wordOfDay')}
          style={[
            styles.navButton,
            activeTab === 'wordOfDay' && styles.navButtonActive
          ]}
        >
          <Text style={[
            styles.navButtonText,
            activeTab === 'wordOfDay' && styles.navButtonTextActive
          ]}>
            🌟 Word of the Day
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setActiveTab('dictionary')}
          style={[
            styles.navButton,
            activeTab === 'dictionary' && styles.navButtonActive
          ]}
        >
          <Text style={[
            styles.navButtonText,
            activeTab === 'dictionary' && styles.navButtonTextActive
          ]}>
            📚 Dictionary
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setActiveTab('quiz')}
          style={[
            styles.navButton,
            activeTab === 'quiz' && styles.navButtonActive
          ]}
        >
          <Text style={[
            styles.navButtonText,
            activeTab === 'quiz' && styles.navButtonTextActive
          ]}>
            🎯 Quiz
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {activeTab === 'wordOfDay' && <WordOfDay words={sampleWords} />}
        {activeTab === 'dictionary' && <Dictionary words={sampleWords} />}
        {activeTab === 'quiz' && <Quiz words={sampleWords} />}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ for the Burundian community worldwide</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#15803d',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  navigation: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'transparent',
  },
  navButtonActive: {
    borderBottomColor: '#16a34a',
  },
  navButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },
  navButtonTextActive: {
    color: '#15803d',
  },
  content: {
    flex: 1,
  },
  footer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default App;