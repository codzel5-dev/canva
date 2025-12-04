import { useEffect, useState } from 'react';
import { fabric } from 'fabric';

interface UseVoiceCommandsProps {
  canvas: fabric.Canvas | null;
  addText: (text: string) => void;
  addShape: (type: string) => void;
  deleteActive: () => void;
  changeColor: (color: string) => void;
}

export const useVoiceCommands = ({ canvas, addText, addShape, deleteActive, changeColor }: UseVoiceCommandsProps) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSupported(true);
    }
  }, []);

  const startListening = () => {
    if (!supported) return;
    
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const command = event.results[0][0].transcript.toLowerCase();
      setTranscript(command);
      processCommand(command);
    };

    recognition.start();
  };

  const processCommand = (command: string) => {
    console.log('Voice Command:', command);

    if (command.includes('add text')) {
      addText('New Text');
    } else if (command.includes('add circle')) {
      addShape('circle');
    } else if (command.includes('add rectangle') || command.includes('add box')) {
      addShape('rect');
    } else if (command.includes('add triangle')) {
      addShape('triangle');
    } else if (command.includes('delete') || command.includes('remove')) {
      deleteActive();
    } else if (command.includes('color')) {
      const colors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'purple', 'orange'];
      const foundColor = colors.find(c => command.includes(c));
      if (foundColor) changeColor(foundColor);
    } else if (command.includes('center')) {
      const active = canvas?.getActiveObject();
      if (active) {
        canvas?.centerObject(active);
        canvas?.renderAll();
      }
    }
  };

  return { isListening, transcript, startListening, supported };
};
