// quiz.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

///////////////////////
// Data & Utilities  //
///////////////////////

interface QuestionOption {
  id: string;
  text: string;
  score: number;
}

interface MentalHealthQuestion {
  id: number;
  question: string;
  options: QuestionOption[];
  category: string;
}

interface Results {
  level: string;
  description: string;
  recommendation: string;
}

const MHQuestions: MentalHealthQuestion[] = [
  {
    id: 1,
    question: "How often have you felt down, depressed, or unmotivated during the whole week?",
    options: [
      { id: 'a', text: "Not at all", score: 0 },
      { id: 'b', text: "Several days", score: 1 },
      { id: 'c', text: "More than half the days", score: 2 },
      { id: 'd', text: "Nearly every day", score: 3 }
    ],
    category: "mood"
  },
  {
    id: 2,
    question: "How often have you had little interest or pleasure in doing things you usually enjoy?",
    options: [
      { id: 'a', text: "Not at all", score: 0 },
      { id: 'b', text: "Several days", score: 1 },
      { id: 'c', text: "More than half the days", score: 2 },
      { id: 'd', text: "Nearly every day", score: 3 }
    ],
    category: "anhedonia"
  },
  {
    id: 3,
    question: "How often have you felt nervous, anxious, or on edge?",
    options: [
      { id: 'a', text: "Not at all", score: 0 },
      { id: 'b', text: "Several days", score: 1 },
      { id: 'c', text: "More than half the days", score: 2 },
      { id: 'd', text: "Nearly every day", score: 3 }
    ],
    category: "anxiety"
  },
  {
    id: 4,
    question: "How difficult has it been to concentrate on things, such as reading or watching TV?",
    options: [
      { id: 'a', text: "Not difficult at all", score: 0 },
      { id: 'b', text: "Somewhat difficult", score: 1 },
      { id: 'c', text: "Very difficult", score: 2 },
      { id: 'd', text: "Extremely difficult", score: 3 }
    ],
    category: "concentration"
  },
  {
    id: 5,
    question: "How often have you had trouble falling or staying asleep, or sleeping too much?",
    options: [
      { id: 'a', text: "Not at all", score: 0 },
      { id: 'b', text: "Several days", score: 1 },
      { id: 'c', text: "More than half the days", score: 2 },
      { id: 'd', text: "Nearly every day", score: 3 }
    ],
    category: "sleep"
  },
  {
    id: 6,
    question: "How often have you felt tired or had little energy?",
    options: [
      { id: 'a', text: "Not at all", score: 0 },
      { id: 'b', text: "Several days", score: 1 },
      { id: 'c', text: "More than half the days", score: 2 },
      { id: 'd', text: "Nearly every day", score: 3 }
    ],
    category: "energy"
  },
  {
    id: 7,
    question: "How often have you had poor appetite or been overeating?",
    options: [
      { id: 'a', text: "Not at all", score: 0 },
      { id: 'b', text: "Several days", score: 1 },
      { id: 'c', text: "More than half the days", score: 2 },
      { id: 'd', text: "Nearly every day", score: 3 }
    ],
    category: "appetite"
  },
  {
    id: 8,
    question: "How often have you felt bad about yourself or that you are a failure?",
    options: [
      { id: 'a', text: "Not at all", score: 0 },
      { id: 'b', text: "Several days", score: 1 },
      { id: 'c', text: "More than half the days", score: 2 },
      { id: 'd', text: "Nearly every day", score: 3 }
    ],
    category: "self-worth"
  },
  {
    id: 9,
    question: "How often have you had thoughts that you would be better off dead or of hurting yourself?",
    options: [
      { id: 'a', text: "Not at all", score: 0 },
      { id: 'b', text: "Several days", score: 1 },
      { id: 'c', text: "More than half the days", score: 2 },
      { id: 'd', text: "Nearly every day", score: 3 }
    ],
    category: "suicidal-ideation"
  },
  {
    id: 10,
    question: "How often have you felt overwhelmed by your responsibilities?",
    options: [
      { id: 'a', text: "Not at all", score: 0 },
      { id: 'b', text: "Several days", score: 1 },
      { id: 'c', text: "More than half the days", score: 2 },
      { id: 'd', text: "Nearly every day", score: 3 }
    ],
    category: "stress"
  }
];

const interpretResults = (totalScore: number): Results => {
  if (totalScore <= 4) {
    return {
      level: "Minimal",
      description: "Your responses suggest minimal symptoms. Continue with self-care practices.",
      recommendation: "GOOD JOB! Continue focusing on maintaining your current healthy habits."
    };
  } else if (totalScore <= 9) {
    return {
      level: "Mild",
      description: "Your responses suggest mild symptoms. Consider some lifestyle adjustments.",
      recommendation: "YOU CAN DO IT! Try adding regular exercise, mindfulness, and better sleep habits."
    };
  } else if (totalScore <= 14) {
    return {
      level: "Moderate",
      description: "Your responses suggest moderate symptoms that may benefit from intervention.",
      recommendation: "YOU MATTER! Consider speaking with Friends and Family Members"
    };
  } else if (totalScore <= 19) {
    return {
      level: "Moderately Severe",
      description: "Your responses suggest moderately severe symptoms.",
      recommendation: 'Please consider seeking professional advice and counselling'
    };
  } else {
    return {
      level: "Severe",
      description: "Your responses suggest severe symptoms that require attention.",
      recommendation: 'Keep Yourself Safe. Please consult with a mental health professional'
    };
  }
};

///////////////////////
// UI Components     //
///////////////////////

// Welcome Screen
const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <SafeAreaView style={styles.safeArea}>
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeTitle}>Welcome!</Text>
      <Text style={styles.welcomeQuote}>
        "Taking care of your mind is just as important as taking care of your body.
        Always check in with yourself – you deserve it."
      </Text>
      <TouchableOpacity style={styles.button} onPress={onStart}>
        <Text style={styles.buttonText}>Take the Quiz</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);

// Quiz Item
const QuizItem: React.FC<{
  question: MentalHealthQuestion;
  onSelect: (questionId: number, optionId: string, score: number) => void;
  selectedOption?: string;
}> = ({ question, onSelect, selectedOption }) => (
  <View style={styles.questionContainer}>
    <Text style={styles.questionText}>{question.question}</Text>
    <View style={styles.optionsContainer}>
      {question.options.map(option => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.optionButton,
            selectedOption === option.id && styles.selectedOption
          ]}
          onPress={() => onSelect(question.id, option.id, option.score)}
        >
          <Text style={[
            styles.optionText,
            selectedOption === option.id && styles.selectedOptionText
          ]}>
            {option.text}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

// Results Screen
const ResultsScreen: React.FC<{
  score: number;
  totalQuestions: number;
  onRetake: () => void;
  onClose: () => void;
}> = ({ score, totalQuestions, onRetake, onClose }) => {
  const results = interpretResults(score);
  return (
    <ScrollView contentContainerStyle={styles.resultsContainer}>
      <Text style={styles.scoreTitle}>Your Assessment Results</Text>
      <View style={styles.scoreCircle}>
        <Text style={styles.scoreText}>{score}</Text>
        <Text style={styles.maxScoreText}>/ {totalQuestions * 3}</Text>
      </View>
      <Text style={styles.resultLevel}>{results.level}</Text>
      <View style={styles.resultInfo}>
        <Text style={styles.resultDescription}>{results.description}</Text>
        <Text style={styles.resultRecommendation}>{results.recommendation}</Text>
      </View>
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          This assessment is not a diagnostic tool. It's designed to help you understand your current mental health status. For a proper diagnosis, please consult with a qualified mental health professional.
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onRetake}>
        <Text style={styles.buttonText}>Retake Assessment</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

///////////////////////
// Main Quiz Screen  //
///////////////////////

const Quiz: React.FC = () => {
  // "welcome" | "quiz" | "results"
  const [screen, setScreen] = useState<'welcome' | 'quiz' | 'results'>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: { optionId: string; score: number } }>({});
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress((Object.keys(answers).length / MHQuestions.length) * 100);
  }, [answers]);

  const handleSelect = (questionId: number, optionId: string, optionScore: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: { optionId, score: optionScore }
    }));
  };

  const handleNext = () => {
    if (currentQuestion === MHQuestions.length - 1) {
      let totalScore = 0;
      Object.values(answers).forEach(ans => totalScore += ans.score);
      setScore(totalScore);
      setScreen('results');
    } else {
      setCurrentQuestion(q => q + 1);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setScore(0);
    setScreen('quiz');
  };

  const handleBackToHome = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setScore(0);
    setScreen('welcome');
  };

  // Render screens
  if (screen === 'welcome') {
    return <WelcomeScreen onStart={() => setScreen('quiz')} />;
  }

  if (screen === 'results') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ResultsScreen
          score={score}
          totalQuestions={MHQuestions.length}
          onRetake={handleRetake}
          onClose={handleBackToHome}
        />
      </SafeAreaView>
    );
  }

  // Quiz screen
  const currentQuestionData = MHQuestions[currentQuestion];
  const isAnswered = answers[currentQuestionData.id] !== undefined;
  const isLastQuestion = currentQuestion === MHQuestions.length - 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mental Health Quiz</Text>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}% completed</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <QuizItem
          question={currentQuestionData}
          onSelect={handleSelect}
          selectedOption={answers[currentQuestionData.id]?.optionId}
        />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navButton, currentQuestion === 0 && styles.disabledButton]}
          onPress={() => setCurrentQuestion(q => Math.max(q - 1, 0))}
          disabled={currentQuestion === 0}
        >
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.nextButton,
            !isAnswered && styles.disabledButton
          ]}
          onPress={handleNext}
          disabled={!isAnswered}
        >
          <Text style={styles.navButtonText}>{isLastQuestion ? 'Finish' : 'Next'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

///////////////////////
// Styles            //
///////////////////////

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  // Welcome screen styles
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5F9EA0',
    marginBottom: 30,
    textAlign: 'center',
  },
  welcomeQuote: {
    fontSize: 20,
    color: '#333',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 32,
  },
  // Quiz & results styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15,
  },
  progressContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#5F9EA0',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  container: {
    flexGrow: 1,
    padding: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#ccc',
    minWidth: 100,
    alignItems: 'center',
  },
  nextButton: {
    backgroundColor: '#5F9EA0',
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  questionContainer: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 15,
    color: '#333',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedOption: {
    backgroundColor: '#5F9EA0',
    borderColor: '#5F9EA0',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '500',
  },
  resultsContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scoreTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#5F9EA0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    alignSelf: 'center',
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  maxScoreText: {
    fontSize: 16,
    color: '#fff',
  },
  resultLevel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  resultInfo: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  resultDescription: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
  },
  resultRecommendation: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  disclaimer: {
    marginBottom: 30,
  },
  disclaimerText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#5F9EA0',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    minWidth: 180,
    alignSelf: 'center',
  },
  closeButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Quiz;