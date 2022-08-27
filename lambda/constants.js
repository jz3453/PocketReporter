module.exports = {
    Topics_to_Sources: {
        "WORLD NEWS": ["CNN NEWS", "NBC NEWS", "THE NEW YORK TIMES", "WALL STREET JOURNAL"],
        "US NEWS": ["CNN NEWS", "THE NEW YORK TIMES"],
        "TOP STORIES": ["CNN NEWS", "NBC NEWS"],
        "POLITICS": ["CNN NEWS", "NBC NEWS", "THE NEW YORK TIMES"],
        "BUSINESS": ["CNN NEWS", "THE NEW YORK TIMES", "WALL STREET JOURNAL"],
        "HEALTH": ["CNN NEWS", "NBC NEWS", "THE NEW YORK TIMES"],
        "SCIENCE": ["NBC NEWS", "THE NEW YORK TIMES"],
        "TECHNOLOGY": ["CNN NEWS", "THE NEW YORK TIMES", "WALL STREET JOURNAL"],
        "ENTERTAINMENT": ["CNN NEWS", "NBC NEWS", "THE NEW YORK TIMES"],
        "TRAVEL": ["CNN NEWS", "THE NEW YORK TIMES"],
        "SPORTS": ["THE NEW YORK TIMES", "ESPN"],
        "FASHION": ["THE NEW YORK TIMES", "VANITY FAIR"],
        "ARTS": ["THE NEW YORK TIMES"],
        "CELEBRITY NEWS": ["TMZ"],
        "GOOD NEWS": ["GOOD NEWS NETWORK"]
    },
    CNN_RSS_MAP: {
        "TOP STORIES": "http://rss.cnn.com/rss/cnn_topstories.rss",
        "WORLD NEWS": "http://rss.cnn.com/rss/cnn_world.rss",
        "US NEWS": "http://rss.cnn.com/rss/cnn_us.rss",
        "BUSINESS": "http://rss.cnn.com/rss/money_latest.rss",
        "POLITICS": "http://rss.cnn.com/rss/cnn_allpolitics.rss",
        "TECHNOLOGY": "http://rss.cnn.com/rss/cnn_tech.rss",
        "HEALTH": "http://rss.cnn.com/rss/cnn_health.rss",
        "ENTERTAINMENT": "http://rss.cnn.com/rss/cnn_showbiz.rss",
        "TRAVEL": "http://rss.cnn.com/rss/cnn_travel.rss"
    },
    NBC_RSS_MAP: {
        "TOP STORIES": "https://feeds.nbcnews.com/nbcnews/public/news",
        "WORLD NEWS": "https://feeds.nbcnews.com/nbcnews/public/world",
        "POLITICS": "http://rss.cnn.com/rss/cnn_allpolitics.rss",
        "HEALTH": "http://rss.cnn.com/rss/cnn_health.rss",
        "SCIENCE": "http://rss.cnn.com/rss/cnn_travel.rss",
        "ENTERTAINMENT": "http://rss.cnn.com/rss/cnn_showbiz.rss"
    },
    TMZ_RSS_MAP: {
        "CELEBRITY NEWS": "https://www.tmz.com/rss.xml"
    },
    GNN_RSS_MAP: {
        "GOOD NEWS": "https://www.goodnewsnetwork.org/category/news/feed/"
    },
    NYT_RSS_MAP: {
        "WORLD NEWS": "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
        "US NEWS": "https://rss.nytimes.com/services/xml/rss/nyt/US.xml",
        "POLITICS": "https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml",
        "BUSINESS": "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
        "HEALTH": "https://rss.nytimes.com/services/xml/rss/nyt/Health.xml",
        "SCIENCE": "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml",
        "TECHNOLOGY": "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
        "ENTERTAINMENT": "https://rss.nytimes.com/services/xml/rss/nyt/Movies.xml",
        "TRAVEL": "https://rss.nytimes.com/services/xml/rss/nyt/Travel.xml",
        "SPORTS": "https://rss.nytimes.com/services/xml/rss/nyt/Sports.xml",
        "FASHION": "https://rss.nytimes.com/services/xml/rss/nyt/FashionandStyle.xml",
        "ARTS": "https://rss.nytimes.com/services/xml/rss/nyt/Arts.xml"
    },
    WSJ_RSS_MAP: {
        "WORLD NEWS": "https://feeds.a.dj.com/rss/RSSWorldNews.xml",
        "BUSINESS": "https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml",
        "TECHNOLOGY": "https://feeds.a.dj.com/rss/RSSWSJD.xml"
    },
    VF_RSS_MAP: {
        "FASHION": "https://rss.app/feeds/PAP5rTYjgWud0Dmq.xml"
    },
    ESPN_RSS_MAP: {
        "SPORTS": "https://www.espn.com/espn/rss/news"
    }
}