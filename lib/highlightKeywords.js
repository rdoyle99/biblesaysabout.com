// Function to highlight topic keywords in verse text
export function highlightKeywords(text, topic) {
  if (!text || !topic) return text;
  
  // Define keywords for each topic
  const topicKeywords = {
    strength: ['strength', 'strong', 'strengthen', 'strengthens', 'strengthened'],
    love: ['love', 'loved', 'loves', 'loving', 'beloved'],
    peace: ['peace', 'peaceful', 'peacefully'],
    hope: ['hope', 'hoped', 'hopes', 'hoping'],
    faith: ['faith', 'faithful', 'faithfully', 'believe', 'believes', 'belief'],
    anxiety: ['anxiety', 'anxious', 'worry', 'worried', 'worries'],
    healing: ['heal', 'healed', 'heals', 'healing', 'restore', 'restored'],
    forgiveness: ['forgive', 'forgives', 'forgiveness', 'forgiven'],
    comfort: ['comfort', 'comforted', 'comforts', 'comforting'],
    wisdom: ['wisdom', 'wise', 'wisely'],
    guidance: ['guide', 'guides', 'guidance', 'guided', 'direct', 'direction'],
    gratitude: ['thank', 'thanks', 'thanksgiving', 'grateful', 'gratitude'],
    protection: ['protect', 'protected', 'protection', 'shield', 'refuge'],
    blessings: ['bless', 'blessed', 'blessing', 'blessings'],
    provision: ['provide', 'provides', 'provision', 'provisions'],
    depression: ['depression', 'depressed', 'downcast', 'despair'],
    worry: ['worry', 'worried', 'worries', 'anxious'],
    fear: ['fear', 'afraid', 'fears', 'fearful'],
    marriage: ['marriage', 'married', 'husband', 'wife', 'spouse'],
    trust: ['trust', 'trusted', 'trusts', 'trusting']
  };
  
  const keywords = topicKeywords[topic] || [];
  
  let highlightedText = text;
  
  keywords.forEach(keyword => {
    // Create regex to match the keyword (case insensitive, whole words only)
    const regex = new RegExp(`\\b(${keyword})\\b`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 text-yellow-900 px-1 rounded">$1</mark>');
  });
  
  return highlightedText;
}