import DatabaseAdapter from "../config/DatabaseAdapter.js";
import {getPerformanceTestMode, setPerformanceTestMode} from '../app.js'
import express from 'express';
const router = express.Router();
/**
 * @swagger
 * /test/performance/start:
 *   post:
 *     tags:
 *       - Test
 *     summary: Initiates the performance test.
 *     description: Starts the performance test with the specified duration and request interval. The test will stop automatically after the specified duration and return the results.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               duration:
 *                 type: integer
 *                 description: Duration of the performance test in seconds.
 *               interval:
 *                 type: integer
 *                 description: Interval between two successive requests in milliseconds.
 *     responses:
 *       200:
 *         description: Performance test completed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalPostCalls:
 *                   type: integer
 *                   description: Total number of POST requests made during the test.
 *                 totalGetCalls:
 *                   type: integer
 *                   description: Total number of GET requests made during the test.
 *       400:
 *         description: Invalid input parameters.
 */

router.post('/performance/start', async (req, res) => {
    try{
        // setPerformanceTestMode(true);
        DatabaseAdapter.setTestDatabaseName("tempdb.sqlite")
        DatabaseAdapter.switchDatabase('test');
        const database = DatabaseAdapter.getDatabase();
        await database.authenticate();
        await DatabaseAdapter.reinitializeModels();
        console.log("changed to test database");
        res.status(202).json({ message: 'Performance test started' });
    } catch (err){
        console.error(error);
        res.status(500).json({ message: 'Error starting performance test' });
    }
});

router.post('/performance/end', async (req, res) => {
    try{
        // setPerformanceTestMode(false);
        let database = DatabaseAdapter.getDatabase();
        await database.close();
        DatabaseAdapter.switchDatabase('default');
        database = DatabaseAdapter.getDatabase();
        await database.authenticate();
        await DatabaseAdapter.reinitializeModels();
        console.log("change back to mysql database");
        res.status(202).json({ message: 'Performance test ended' });
    } catch (err) {
        console.error(error);
        res.status(500).json({ message: 'Error ending performance test' });
    }
});

export default router;