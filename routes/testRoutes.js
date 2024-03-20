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