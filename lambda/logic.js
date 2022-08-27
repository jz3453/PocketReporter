const axios = require('axios');
const constants = require('./constants');
const interceptors = require('./interceptors');

module.exports = {
    fetchArticles(newsSource, topic, handlerInput) {
        const endpoint = "https://api.factmaven.com/xml-to-json?xml=";
        const url = endpoint + module.exports.formatRSSURL(newsSource, topic)
        
        var config = {
            timeout: 8000
        };

        async function getJsonResponse(url, config){
            const res = await axios.get(url, config);
            return res.data;
        }

        return getJsonResponse(url, config).then((result) => {
            var articleTitles = "";
            
            for(let i = 0; i < 3; i++){
                articleTitles += result.rss.channel.item[i].title + ". ";
                articleTitles += handlerInput.t('SHORT_PAUSE');
            }
            return articleTitles;
        }).catch((error) => {
            return null;
        });
    },
    formatRSSURL(newsSource, topic) {
        switch(newsSource) {
            case "CNN NEWS":
                return module.exports.formatCNNURL(topic);
            case "NBC NEWS":
                return module.exports.formatNBCURL(topic);
            case "THE NEW YORK TIMES":
                return module.exports.formatNYTURL(topic);
            case "WALL STREET JOUNRAL":
                return module.exports.formatWSJURL(topic);
            case "TMZ":
                return module.exports.formatTMZURL(topic);
            case "GOOD NEWS NETWORK":
                return module.exports.formatGNNURL(topic);
            case "VANITY FAIR":
                return module.exports.formatVFURL(topic);
            case "ESPN":
                return module.exports.formatESPNURL(topic);
            default:
                break;
                
        }
    },
    formatCNNURL(topic) {
        return constants.CNN_RSS_MAP[topic]
    },
    formatNBCURL(topic) {
        return constants.NBC_RSS_MAP[topic]
    },
    formatNYTURL(topic) {
        return constants.NYT_RSS_MAP[topic]
    },
    formatWSJURL(topic) {
        return constants.WSJ_RSS_MAP[topic]
    },
    formatTMZURL(topic) {
        return constants.TMZ_RSS_MAP[topic]
    },
    formatGNNURL(topic) {
        return constants.GNN_RSS_MAP[topic]
    },
    formatVFURL(topic) {
        return constants.VF_RSS_MAP[topic]
    },
    formatESPNURL(topic) {
        return constants.ESPN_RSS_MAP[topic]
    }
}