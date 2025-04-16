import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Keyboard, Modal, SafeAreaView, Dimensions } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';

// message type
type Message = {
    id: string;
    text: string;
    isBot: boolean;
};

// chatbot props
type ChatbotInterfaceProps = {
    initialMessages?: Message[];
    onSendMessage?: (message: string) => void;
    botName?: string;
};

export const ChatInterface = ({ initialMessages = [{ id: '1', text: '✨ Hello!', isBot: true }], onSendMessage, botName = 'Montana' }: ChatbotInterfaceProps) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [inputText, setInputText] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const inputRef = useRef<TextInput>(null);

    // autoscroll to bottom when new message is added
    useEffect(() => {
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    // handle sending messages
    const handleSend = () => {
        if (inputText.trim()) {
            // add user message
            const userMessage: Message = {
                id: Date.now().toString(),
                text: inputText,
                isBot: false,
            };

            setMessages((prevMessages) => [...prevMessages, userMessage]);
            setInputText('');

            // callback for parent component
            if (onSendMessage) {
                onSendMessage(inputText);
            }

            // bot response (put openai api call here)
            setTimeout(() => {
                const botResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: 'I received your message. This is automated response. Please connect your chatbot api for real response.',
                    isBot: true,
                };
                setMessages(prevMessages => [...prevMessages, botResponse]);
            }, 1000)
        }
    };

    // toggle expanded view
    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
            if (!isExpanded) {
                inputRef.current?.focus();
            }
        }, 300)
    };

    // compact chat view
    const renderCompactChat = () => {
        return (
            <View style={styles.chatBox}>
            <View style={styles.headerRow}>
                <Text style={styles.chatTitle}> Talk to {botName} </Text>
                <TouchableOpacity onPress={toggleExpanded}>
                    <Ionicons name="expand" size={20} color="#4B4B4B" />
                </TouchableOpacity>
            </View>
            <ScrollView ref={scrollViewRef} style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
                {messages.map(message => (
                    <View key={message.id} style={[styles.messageBubble, message.isBot ? styles.botBubble : styles.userBubble]}>
                        <Text style={message.isBot ? styles.botText : styles.userText}> {message.text} </Text>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.inputRow}>
                <TextInput ref={inputRef} style={styles.input} placeholder="Reply" placeholderTextColor="#999" value={inputText} onChangeText={setInputText} multiline />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Entypo name="arrow-bold-right" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
        )
    };

    // expanded chat view
    const renderExpandedChat = () => {
        return(
            <Modal visible={isExpanded} animationType="slide" presentationStyle="fullScreen">
            <SafeAreaView style={styles.expandedContainer}>
                <View style={styles.expandedHeader}>
                    <TouchableOpacity onPress={toggleExpanded} style={styles.backButton}>
                        <Ionicons name="chevron-back" size={24} color="#4B4B4B" />
                    </TouchableOpacity>
                    <Text style={styles.expandedTitle}> {botName} </Text>
                    <View style={{ width: 24 }} />
                </View>

                <ScrollView ref={scrollViewRef} style={styles.expandedMessagesContainer} contentContainerStyle={styles.expandedMessagesContent}>
                    {messages.map(message => (
                        <View key={message.id} style={[styles.messageBubble, message.isBot ? styles.botBubble : styles.userBubble]}>
                            <Text style={message.isBot ? styles.botText : styles.userText}> {message.text} </Text>
                        </View>
                    ))}
                </ScrollView>

                <View style={styles.expandedInputRow}>
                    <TextInput ref={inputRef} style={styles.expandedInput} placeholder="Type a message..." placeholderTextColor="#999" value={inputText} onChangeText={setInputText} multiline />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Entypo name="arrow-bold-right" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </Modal>
        )
    };

    return (
        <>
            {renderCompactChat()}
            {renderExpandedChat()}
        </>
    );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    chatBox: {
        backgroundColor: '#EAF3F1',
        height: 350,
        marginHorizontal: 15,
        borderRadius: 15,
        padding: 10,
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    chatTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4B4B4B',
    },
    messagesContainer: {
        flex: 1,
        marginBottom: 50, 
    },
    messagesContent: {
        paddingBottom: 10,
    },
    messageBubble: {
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        maxWidth: '80%',
    },
    botBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#699992',
    },
    botText: {
        color: '#333',
    },
    userText: {
        color: '#fff',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 10,
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
    },
    input: {
        flex: 1,
        minHeight: 20,
        maxHeight: 100,
        paddingHorizontal: 10,
    },
    sendButton: {
        backgroundColor: '#4B4B4B',
        borderRadius: 50,
        padding: 10,
    },
    expandedContainer: {
        flex: 1,
        backgroundColor: '#EAF3F1',
    },
    expandedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        padding: 5,
    },
    expandedTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#4B4B4B',
    },
    expandedMessagesContainer: {
        flex: 1,
    },
    expandedMessagesContent: {
        padding: 15,
        paddingBottom: 30,
    },
    expandedInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#fff",
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    expandedInput: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        paddingHorizontal: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        marginRight: 10,
    },
});

export default ChatInterface;

