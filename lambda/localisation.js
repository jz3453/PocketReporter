module.exports = {
    en: {
        translation: {
            POSITIVE_SOUND: `<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_02'/>`,
            KEYBOARD_SOUND: '<audio src="soundbank://soundlibrary/office/amzn_sfx_typing_short_01"/>',
            AFFIRMATIVE_SPEECHCON: '<say-as interpret-as="interjection">absolutely</say-as>',
            SURE_SPEECHCON: '<amazon:emotion name="excited" intensity="medium"> Sure thing! </amazon:emotion>',
            DOUBT_SPEECHCON: `<say-as interpret-as="interjection">hmm</say-as>`,
            UH_OH_SPEECHCON: `<say-as interpret-as="interjection">uh oh</say-as>`,
            SHORT_PAUSE: '<break time="1s"/>',
            PAUSE_SPEECHCON: '<break time="2s"/>',
            WELCOME_MSG: `$t(POSITIVE_SOUND) $t(SHORT_PAUSE) <amazon:emotion name="excited" intensity="medium"> Hi there {{name}}, this is Pocket Reporter! What kind of news would you like to hear about today? </amazon:emotion>`,
            WELCOME_BACK_MSG: '$t(POSITIVE_SOUND) $t(SHORT_PAUSE) <amazon:emotion name="excited" intensity="medium"> Welcome back {{name}}! This is Pocket Reporter. What kind of news would you like to hear about today? </amazon:emotion>',
            WHICH_SOURCE_MSG: ['Sure! Is there a particular news source you would like to hear from? For {{topic}} I have ', 'Of course! Is there a particular news source you would like to hear from? For {{topic}} I have '],
            PRESENTING_NEWS_MSG: ['$t(AFFIRMATIVE_SPEECHCON), here are today\'s top 3 headlines in {{topic}} from {{newsSource}}: $t(SHORT_PAUSE)', '$t(SURE_SPEECHCON), here are today\'s top 3 headlines in {{topic}} from {{newsSource}}: $t(SHORT_PAUSE)'],
            UNSUPPORTED_TOPIC_MSG: '$t(UH_OH_SPEECHCON), it looks like {{newsSource}} doesn\'t report on {{topic}}.',
            UNPROVIDED_MSG: '$t(DOUBT_SPEECHCON), it looks like {{newsSource}} doesn\'t report on {{topic}}. Their loss. Would you like to hear about a different topic from {{newsSource}}, or hear from a different news source?',
            HELP_MSG: 'How can I help?',
            INSTRUCTIONS_MSG: 'No worries! Let me introduce myself. My name is Pocket Reporter, and I can fetch you any news at my disposal. I personally like to read from CNN News, NBC News, The New York Times, and Wall Street Journal, and I can read about a variety of different topics, from World News to Celebrity News.\
            If you would like to hear the full list of topics I offer, just ask me! If you would like to hear about a certain topic, just say, can I hear about (dot dot dot). You can also add topics from news sources to your favorites for easy access in the future. For example, if you add World News from CNN News to favorites, \
            the next time you start a session, all you have to do is say Debrief Me to hear about it. You can add multiple topics, and you can also remove topics too! Why don\'t you start off by trying it out?',
            GOODBYE_MSG: ['Goodbye {{name}}! ', 'See you next time {{name}}!'],
            FALLBACK_MSG: `Sorry, I don't know about that. Please try again.`,
            ERROR_MSG: 'Sorry, there was an error. Please try again.',
            REFLECTOR_MSG: 'You just triggered {{intent}}'
            
        }
    }
}