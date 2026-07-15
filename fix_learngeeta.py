import sys

with open('app/containers/LearnGeeta/index.js', 'r') as f:
    content = f.read()

hooks = '''
  const { start, copilotEvents } = useCopilot();
  const hasStartedGuide = useRef(false);
  const startRef = useRef(start);
  const copilotEventsRef = useRef(copilotEvents);

  startRef.current = start;
  copilotEventsRef.current = copilotEvents;

  useEffect(() => {
    const checkTutorial = async () => {
      if (hasStartedGuide.current) return;
      try {
        const hasSeen = await AsyncStorage.getItem('HAS_SEEN_LEARNGEETA_TUTORIAL');
        if (!hasSeen) {
          hasStartedGuide.current = true;
          setTimeout(() => {
            startRef.current();
          }, 1500);
        }
      } catch (e) {}
    };
    checkTutorial();
  }, []);

  useEffect(() => {
    const handleStop = () => {
      AsyncStorage.setItem('HAS_SEEN_LEARNGEETA_TUTORIAL', 'true').catch(() => {});
    };
    copilotEventsRef.current.on('stop', handleStop);
    return () => {
      copilotEventsRef.current.off('stop', handleStop);
    };
  }, []);
'''

if 'const { start, copilotEvents } = useCopilot();' not in content:
    content = content.replace("const currentLanguage = language?.currentLanguage;", "const currentLanguage = language?.currentLanguage;\n" + hooks)
    with open('app/containers/LearnGeeta/index.js', 'w') as f:
        f.write(content)
