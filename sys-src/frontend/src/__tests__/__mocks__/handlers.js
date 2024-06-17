import { http, HttpResponse } from 'msw'

export const handlers = [
  // This is a mock handler for the GET /api/teams endpoint
  http.get('/api/teams', () => {
    console.log("GET teams")
    //mocked response using the res function
    return HttpResponse.json({
        // Mock data
        teams: ['Team A', 'Team B', 'Team C'],
      })
  }),

  http.get('/api/predict', (req, res, ctx) => {
    console.log("GET prediction")

    // Return the mocked response with the provided probabilities
    return HttpResponse.json({
        prediction: "Team A",
        probabilities: {
          win: 0.6,
          draw: 0.3,
          lose: 0.1,
        },
      })
  }),
  
];
