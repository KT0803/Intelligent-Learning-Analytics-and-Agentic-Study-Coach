import { Router, Response } from 'express';
import { authenticateToken } from './auth';
import { AuthRequest, ResearchQuery } from './types';
import { researchEngine } from './services/researchEngine';

const router = Router();

router.post('/query', authenticateToken, async (req: AuthRequest, res: Response) => {
  const query: ResearchQuery = req.body as ResearchQuery;

  
  try {
    console.log(`Processing research query: ${query.topic} (${query.depth})`);
    const results = await researchEngine.performResearch(query.topic, query.depth);
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error processing research query', error });
  }
});

router.post('/report', authenticateToken, async (req: AuthRequest, res: Response) => {
  const body = req.body;
  try {
    const results = await researchEngine.performResearch(body.query || body.topic, "deep");
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Error generating report', error });
  }
});

router.post('/expand', authenticateToken, async (req: AuthRequest, res: Response) => {
  // Return mock expansions for now to fix 404
  res.json({
    expansions: ["Future implications", "Historical context"],
    subtopics: ["Subtopic A", "Subtopic B"],
    suggestedQuestions: ["How does this impact X?", "What are the alternatives?"]
  });
});

router.get('/history', authenticateToken, (req: AuthRequest, res: Response) => {
  res.json({ history: [] });
});

export default router;
