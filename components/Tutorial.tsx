
import React, { useState, useLayoutEffect, useRef } from 'react';

interface TutorialProps {
    onComplete: () => void;
}

interface Position {
    top: number;
    left: number;
    width: number;
    height: number;
}

const tutorialSteps = [
    {
        elementId: 'topic-form',
        text: 'Welcome to Unpackd! Start your journey by entering any topic you want to learn and choosing your skill level here.',
        position: 'bottom'
    },
    {
        elementId: 'history-button',
        text: 'You can always find your previously generated learning paths in the History panel.',
        position: 'bottom-right'
    },
    {
        elementId: 'math-lab-button',
        text: 'Stuck on a math problem? The Math Lab can explain concepts for you.',
        position: 'bottom-right'
    },
    {
        elementId: 'mia-fab',
        text: "This is Mia, your AI assistant. Click here anytime you have a question about anything!",
        position: 'left'
    }
];

const Tutorial: React.FC<TutorialProps> = ({ onComplete }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const [pos, setPos] = useState<Position | null>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const currentStep = tutorialSteps[stepIndex];
        const element = document.querySelector(`[data-tutorial-id="${currentStep.elementId}"]`) as HTMLElement;

        if (element) {
            const rect = element.getBoundingClientRect();
            setPos({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height
            });
            // Scroll element into view if needed
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [stepIndex]);

    const handleNext = () => {
        if (stepIndex < tutorialSteps.length - 1) {
            setStepIndex(stepIndex + 1);
        } else {
            onComplete();
        }
    };

    const getTooltipPosition = () => {
        if (!pos) return {};
        const position = tutorialSteps[stepIndex].position;
        const offset = 12;

        switch(position) {
            case 'bottom':
                return { top: pos.top + pos.height + offset, left: pos.left };
            case 'bottom-right':
                return { top: pos.top + pos.height + offset, left: pos.left + pos.width - 250 };
            case 'left':
                return { top: pos.top, left: pos.left - 260 };
            default:
                return { top: pos.top + pos.height + offset, left: pos.left };
        }
    };

    return (
        <div ref={overlayRef} className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm pointer-events-none">
            {pos && (
                <>
                    <div
                        className="absolute bg-transparent rounded-lg transition-all duration-300 ease-in-out"
                        style={{
                            top: pos.top - 8,
                            left: pos.left - 8,
                            width: pos.width + 16,
                            height: pos.height + 16,
                            boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.8), 0 0 15px rgba(14, 165, 233, 0.7)',
                            borderColor: 'rgb(14, 165, 233)',
                            borderWidth: '2px',
                        }}
                    ></div>
                    <div 
                        className="absolute z-[101] w-64 p-4 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl transition-all duration-300 ease-in-out pointer-events-auto"
                        style={getTooltipPosition()}
                    >
                        <p className="text-slate-200 mb-4">{tutorialSteps[stepIndex].text}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">{stepIndex + 1} / {tutorialSteps.length}</span>
                            <button
                                onClick={handleNext}
                                className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-500 transition-colors"
                            >
                                {stepIndex === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Tutorial;