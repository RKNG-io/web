import React from 'react';

// Brand colours from guidelines
const colors = {
  charcoal: '#2d2926',
  ice: '#F2F6F9',
  fuchsia: '#D14BA8',
  mint: '#B6E2D3',
  blue: '#A8C3D1',
  ink: '#1a1a1a',
  stone: '#E5E7E9',
  fuchsiaDark: '#a33a85',
  mintLight: '#d4efe6',
};

// ============================================
// 1. SOCIAL QUOTE CARDS
// ============================================

const QuoteCardFuchsia = () => (
  <div style={{
    width: 400,
    height: 400,
    background: colors.fuchsia,
    padding: 48,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontFamily: 'Outfit, system-ui, sans-serif',
    position: 'relative',
    overflow: 'hidden',
  }}>
    {/* Decorative rising line */}
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 48,
      width: 4,
      height: 120,
      background: 'linear-gradient(to top, transparent, rgba(255,255,255,0.4))',
      borderRadius: 2,
    }} />
    
    <div style={{
      fontSize: 32,
      fontWeight: 600,
      color: 'white',
      lineHeight: 1.3,
      letterSpacing: '-0.02em',
    }}>
      You're doing three people's jobs.
      <br />
      <span style={{ opacity: 0.8 }}>Let's fix that.</span>
    </div>
    
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <span style={{
        fontSize: 18,
        fontWeight: 600,
        color: 'white',
        letterSpacing: '-0.02em',
      }}>Reckoning</span>
      <span style={{
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        letterSpacing: '0.1em',
      }}>rkng.com</span>
    </div>
  </div>
);

const QuoteCardDark = () => (
  <div style={{
    width: 400,
    height: 400,
    background: colors.charcoal,
    padding: 48,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontFamily: 'Outfit, system-ui, sans-serif',
    position: 'relative',
  }}>
    <div>
      <div style={{
        fontSize: 14,
        color: colors.fuchsia,
        fontWeight: 500,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        marginBottom: 16,
      }}>The truth</div>
      
      <div style={{
        fontSize: 28,
        fontWeight: 600,
        color: 'white',
        lineHeight: 1.35,
        letterSpacing: '-0.02em',
      }}>
        Most people don't need more advice.
        <br /><br />
        They need permission to act on what they already know.
      </div>
    </div>
    
    <div style={{
      width: '100%',
      height: 3,
      background: `linear-gradient(90deg, transparent, ${colors.fuchsia})`,
      borderRadius: 2,
    }} />
  </div>
);

const QuoteCardMint = () => (
  <div style={{
    width: 400,
    height: 400,
    background: colors.mint,
    padding: 48,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontFamily: 'Outfit, system-ui, sans-serif',
  }}>
    <div style={{
      fontSize: 64,
      fontWeight: 700,
      color: colors.charcoal,
      lineHeight: 1,
      letterSpacing: '-0.03em',
      marginBottom: 16,
    }}>15 min</div>
    
    <div style={{
      fontSize: 18,
      color: colors.charcoal,
      opacity: 0.7,
      marginBottom: 32,
    }}>to complete the questionnaire</div>
    
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}>
      <div style={{
        width: 40,
        height: 2,
        background: colors.charcoal,
        opacity: 0.3,
      }} />
      <span style={{
        fontSize: 16,
        fontWeight: 600,
        color: colors.charcoal,
      }}>90 days of clarity</span>
      <div style={{
        width: 40,
        height: 2,
        background: colors.charcoal,
        opacity: 0.3,
      }} />
    </div>
  </div>
);

// ============================================
// 2. TAGLINE / BRAND STATEMENT CARDS
// ============================================

const TaglineCard = () => (
  <div style={{
    width: 600,
    height: 315,
    background: colors.charcoal,
    padding: 48,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontFamily: 'Outfit, system-ui, sans-serif',
    position: 'relative',
  }}>
    <div style={{
      fontSize: 48,
      fontWeight: 600,
      color: 'white',
      letterSpacing: '-0.02em',
      marginBottom: 8,
      position: 'relative',
      display: 'inline-block',
    }}>
      Reckoning
      <div style={{
        position: 'absolute',
        bottom: -8,
        left: 0,
        right: 0,
        height: 4,
        background: `linear-gradient(90deg, transparent, ${colors.fuchsia})`,
        borderRadius: 2,
      }} />
    </div>
    
    <div style={{
      fontSize: 24,
      color: 'rgba(255,255,255,0.6)',
      marginTop: 24,
    }}>Your time is now.</div>
    
    <div style={{
      position: 'absolute',
      bottom: 48,
      right: 48,
      fontSize: 14,
      color: 'rgba(255,255,255,0.4)',
      letterSpacing: '0.1em',
    }}>rkng.com</div>
  </div>
);

// ============================================
// 3. MINI CHECKLIST CARDS
// ============================================

const ChecklistCard = () => (
  <div style={{
    width: 400,
    height: 500,
    background: colors.ice,
    padding: 40,
    fontFamily: 'Outfit, system-ui, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  }}>
    <div style={{
      fontSize: 12,
      fontWeight: 600,
      color: colors.fuchsia,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 8,
    }}>Phase 1</div>
    
    <div style={{
      fontSize: 24,
      fontWeight: 600,
      color: colors.charcoal,
      marginBottom: 32,
    }}>Demand Validation</div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[
        { task: 'Survey 20 target customers', done: true, priority: 'must' },
        { task: 'Create landing page', done: true, priority: 'must' },
        { task: 'Test 2-3 price points', done: false, priority: 'should' },
        { task: 'Get 3 people to pay £1 deposit', done: false, priority: 'should' },
      ].map((item, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 22,
            height: 22,
            borderRadius: 4,
            border: item.done ? 'none' : `2px solid ${colors.charcoal}`,
            background: item.done ? colors.fuchsia : 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 14,
            fontWeight: 600,
          }}>
            {item.done && '✓'}
          </div>
          <span style={{
            flex: 1,
            fontSize: 15,
            color: colors.charcoal,
            textDecoration: item.done ? 'line-through' : 'none',
            opacity: item.done ? 0.5 : 1,
          }}>{item.task}</span>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            color: item.priority === 'must' ? colors.fuchsia : colors.charcoal,
            opacity: item.priority === 'must' ? 1 : 0.5,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>{item.priority}</span>
        </div>
      ))}
    </div>
    
    <div style={{ flex: 1 }} />
    
    <div style={{
      borderTop: `1px solid ${colors.stone}`,
      paddingTop: 20,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}>
      <span style={{ color: '#2A7F78', fontSize: 14 }}>✓</span>
      <span style={{
        fontSize: 13,
        color: colors.charcoal,
        opacity: 0.6,
        fontStyle: 'italic',
      }}>Phase complete when: 3+ people have paid a deposit</span>
    </div>
  </div>
);

// ============================================
// 4. STAT / NUMBER CARDS
// ============================================

const StatCard = () => (
  <div style={{
    width: 400,
    height: 400,
    background: colors.charcoal,
    padding: 48,
    fontFamily: 'Outfit, system-ui, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }}>
    <div style={{
      fontSize: 14,
      color: colors.mint,
      fontWeight: 500,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 16,
    }}>The hidden cost</div>
    
    <div style={{
      fontSize: 72,
      fontWeight: 700,
      color: 'white',
      lineHeight: 1,
      letterSpacing: '-0.03em',
    }}>£13,000</div>
    
    <div style={{
      fontSize: 18,
      color: 'rgba(255,255,255,0.6)',
      marginTop: 16,
      lineHeight: 1.5,
    }}>
      per year in time spent on<br />
      tasks that could be automated
    </div>
    
    <div style={{
      marginTop: 32,
      fontSize: 13,
      color: 'rgba(255,255,255,0.4)',
    }}>
      5 hrs/week × £50/hr × 52 weeks
    </div>
  </div>
);

// ============================================
// 5. QUESTIONNAIRE PREVIEW
// ============================================

const QuestionnairePreview = () => (
  <div style={{
    width: 400,
    height: 500,
    background: 'white',
    borderRadius: 16,
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    padding: 40,
    fontFamily: 'Outfit, system-ui, sans-serif',
    display: 'flex',
    flexDirection: 'column',
  }}>
    {/* Progress dots */}
    <div style={{
      display: 'flex',
      gap: 8,
      marginBottom: 40,
    }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: i <= 2 ? colors.fuchsia : colors.stone,
        }} />
      ))}
    </div>
    
    <div style={{
      fontSize: 12,
      color: colors.charcoal,
      opacity: 0.5,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      marginBottom: 12,
    }}>What you're building</div>
    
    <div style={{
      fontSize: 26,
      fontWeight: 600,
      color: colors.charcoal,
      lineHeight: 1.3,
      marginBottom: 32,
    }}>
      If this worked, what would your life look like in 12 months?
    </div>
    
    <div style={{
      background: colors.ice,
      borderRadius: 8,
      padding: 16,
      fontSize: 15,
      color: colors.charcoal,
      opacity: 0.7,
      lineHeight: 1.6,
      flex: 1,
      border: `2px solid ${colors.stone}`,
    }}>
      I'd have consistent clients without chasing them, time to actually deliver great work, and maybe even take a holiday without everything falling apart...
    </div>
    
    <div style={{
      marginTop: 24,
      display: 'flex',
      justifyContent: 'flex-end',
    }}>
      <div style={{
        background: colors.fuchsia,
        color: 'white',
        padding: '12px 24px',
        borderRadius: 8,
        fontSize: 15,
        fontWeight: 500,
      }}>Continue →</div>
    </div>
  </div>
);

// ============================================
// 6. SIMPLE TEXT CARDS
// ============================================

const SimpleTextCard = ({ text, bg, textColor }) => (
  <div style={{
    width: 400,
    height: 400,
    background: bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    fontFamily: 'Outfit, system-ui, sans-serif',
  }}>
    <div style={{
      fontSize: 48,
      fontWeight: 600,
      color: textColor,
      textAlign: 'center',
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    }}>{text}</div>
  </div>
);

// ============================================
// 7. JOURNEY MAP SNIPPET
// ============================================

const JourneySnippet = () => (
  <div style={{
    width: 500,
    background: colors.ice,
    borderRadius: 12,
    padding: 32,
    fontFamily: 'Outfit, system-ui, sans-serif',
  }}>
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: `1px solid ${colors.stone}`,
      paddingBottom: 16,
      marginBottom: 20,
    }}>
      <div>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          color: colors.fuchsia,
          letterSpacing: '0.1em',
        }}>PHASE 1</span>
        <span style={{
          fontSize: 18,
          fontWeight: 600,
          color: colors.charcoal,
          marginLeft: 12,
        }}>Demand Validation</span>
      </div>
      <span style={{
        fontSize: 13,
        color: colors.charcoal,
        opacity: 0.5,
      }}>Weeks 1-3</span>
    </div>
    
    <div style={{
      fontSize: 14,
      color: colors.charcoal,
      opacity: 0.7,
      marginBottom: 20,
    }}>Prove people will pay before building anything</div>
    
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[
        { task: 'Survey 20 people in your target market', priority: 'must' },
        { task: 'Create simple landing page', priority: 'must' },
        { task: 'Get 3 people to put down a £1 deposit', priority: 'should' },
      ].map((item, i) => (
        <div key={i} style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 18,
            height: 18,
            borderRadius: 3,
            border: `1.5px solid ${colors.charcoal}`,
            background: 'white',
          }} />
          <span style={{
            flex: 1,
            fontSize: 14,
            color: colors.charcoal,
          }}>{item.task}</span>
          <span style={{
            fontSize: 9,
            fontWeight: 600,
            padding: '3px 8px',
            borderRadius: 4,
            background: item.priority === 'must' ? `${colors.fuchsia}20` : `${colors.charcoal}10`,
            color: item.priority === 'must' ? colors.fuchsia : colors.charcoal,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}>
            {item.priority === 'must' ? '● ' : '○ '}{item.priority}
          </span>
        </div>
      ))}
    </div>
    
    <div style={{
      marginTop: 20,
      paddingTop: 16,
      borderTop: `1px solid ${colors.stone}`,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 12,
      color: colors.charcoal,
      opacity: 0.6,
    }}>
      <span style={{ color: '#2A7F78' }}>✓</span>
      <span style={{ fontStyle: 'italic' }}>Phase complete when: 3+ people have paid a deposit</span>
    </div>
  </div>
);

// ============================================
// MAIN GALLERY COMPONENT
// ============================================

export default function ReckoningVisuals() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#fafafa',
      padding: 48,
      fontFamily: 'Outfit, system-ui, sans-serif',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
      `}</style>
      
      <h1 style={{
        fontSize: 32,
        fontWeight: 600,
        color: colors.charcoal,
        marginBottom: 8,
      }}>Reckoning Visual Examples</h1>
      <p style={{
        fontSize: 16,
        color: colors.charcoal,
        opacity: 0.6,
        marginBottom: 48,
      }}>Light-touch graphics for social, web, and marketing</p>
      
      {/* Section: Quote Cards */}
      <h2 style={{
        fontSize: 14,
        fontWeight: 600,
        color: colors.fuchsia,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 24,
      }}>Quote Cards (1:1 Social)</h2>
      <div style={{ display: 'flex', gap: 24, marginBottom: 64, flexWrap: 'wrap' }}>
        <QuoteCardFuchsia />
        <QuoteCardDark />
        <QuoteCardMint />
      </div>
      
      {/* Section: Tagline */}
      <h2 style={{
        fontSize: 14,
        fontWeight: 600,
        color: colors.fuchsia,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 24,
      }}>Banner / Link Preview (1.91:1)</h2>
      <div style={{ marginBottom: 64 }}>
        <TaglineCard />
      </div>
      
      {/* Section: Stats */}
      <h2 style={{
        fontSize: 14,
        fontWeight: 600,
        color: colors.fuchsia,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 24,
      }}>Stat Cards</h2>
      <div style={{ display: 'flex', gap: 24, marginBottom: 64, flexWrap: 'wrap' }}>
        <StatCard />
      </div>
      
      {/* Section: Simple Text */}
      <h2 style={{
        fontSize: 14,
        fontWeight: 600,
        color: colors.fuchsia,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 24,
      }}>Simple Text Cards</h2>
      <div style={{ display: 'flex', gap: 24, marginBottom: 64, flexWrap: 'wrap' }}>
        <SimpleTextCard text="Clarity." bg={colors.mint} textColor={colors.charcoal} />
        <SimpleTextCard text="Action." bg={colors.fuchsia} textColor="white" />
        <SimpleTextCard text="Ready." bg={colors.charcoal} textColor="white" />
      </div>
      
      {/* Section: UI as Visual */}
      <h2 style={{
        fontSize: 14,
        fontWeight: 600,
        color: colors.fuchsia,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 24,
      }}>UI as Visual</h2>
      <div style={{ display: 'flex', gap: 24, marginBottom: 64, flexWrap: 'wrap' }}>
        <QuestionnairePreview />
        <ChecklistCard />
      </div>
      
      {/* Section: Journey Map */}
      <h2 style={{
        fontSize: 14,
        fontWeight: 600,
        color: colors.fuchsia,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 24,
      }}>Journey Map Snippet</h2>
      <div style={{ marginBottom: 64 }}>
        <JourneySnippet />
      </div>
    </div>
  );
}
