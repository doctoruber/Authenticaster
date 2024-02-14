const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event, context) => {
    // Handle OPTIONS request for CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            },
            body: '',
        };
    }

    const { url } = event.queryStringParameters;
    if (!url || !url.startsWith('https://www.launchcaster.xyz')) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid URL parameter' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    }

    try {
        const response = await axios.get(url);
        const data = response.data;
        const $ = cheerio.load(data);
        
        if (!$('.votes_value__9gu2X').length || !$('.details_title__oC_vX').length || !$('.details_date__alm2Z').length) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Required elements not found in the page' }),
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }

        const votes = parseInt($('.votes_value__9gu2X').text(), 10) || 0;
        const timeText = $('.details_date__alm2Z').text();
        const title = $('.details_title__oC_vX').text();

        let ageInHours = 0;
        if (timeText.includes("h")) {
            ageInHours = parseInt(timeText);
        } else if (timeText.includes("d")) {
            ageInHours = parseInt(timeText) * 24;
        }

        let reliabilityScore = calculateReliabilityScore(votes, ageInHours);

        return {
            statusCode: 200,
            body: JSON.stringify({ title, votes, time: timeText, reliabilityScore }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (error) {
        console.error('Failed to fetch data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch data' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    }
};

function calculateReliabilityScore(votes, ageInHours) {
    const maxScoreFromVotes = 80; 
    const maxScoreFromAge = 20;

    let scoreFromVotes = Math.log1p(votes) / Math.log1p(1000) * maxScoreFromVotes; 
    scoreFromVotes = Math.min(scoreFromVotes, maxScoreFromVotes);

    let scoreFromAge = maxScoreFromAge; 
    if (ageInHours > 24) {
        let daysSincePost = (ageInHours - 24) / 24;
        scoreFromAge -= daysSincePost * 5; 
        scoreFromAge = Math.max(0, scoreFromAge); 
    }

    let totalScore = scoreFromVotes + scoreFromAge;
    let reliabilityScore = (totalScore / (maxScoreFromVotes + maxScoreFromAge)) * 100; 

    return reliabilityScore;
}
