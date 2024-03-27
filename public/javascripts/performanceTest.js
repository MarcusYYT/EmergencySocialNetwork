const postData = {
    username: "userTest", 
    user_id: 1,
    status: "OK",
    dateTime: new Date().toLocaleString(),
    content: "testmessage20charrrrr"
  };

let continueTest = false;
let startTime;
let autoEndTimerId;

let postCounter = 0;
let getCounter = 0;

function startPerformanceTest() {
    const duration = getTestDuration();
    const interval = getTestInterval();
    postCounter = 0;
    getCounter = 0; 
    // Check if the values are valid numbers
    if (isNaN(duration) || isNaN(interval)) {
       alert('Please enter valid numbers for Test Duration and Interval.');
       return;
    }
    fetch('/test/performance/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then((data) => {
        console.log(data.message);
        startTime = Date.now();
        startTest(interval, duration);

    })
    .catch(error => alert('Error starting performance test'));
  }

function endPerformanceTest() {
    continueTest = false;
    let endTime = Date.now();
    let duration = (endTime - startTime) / 1000;
    let getSpeed = getCounter / duration;
    let postSpeed = postCounter / duration;
    fetch('/test/performance/end', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(() => {
        clearTimeout(autoEndTimerId);
        alert(`The speed of get is ${getSpeed}/ second \nThe speed of post is ${postSpeed}/second`)
    })
    .catch(error => alert('Error ending performance test'));
}

function getTestDuration() {
    const testDuration = document.getElementById('testDuration').value;
    const durationInSeconds = parseInt(testDuration, 10);
    return durationInSeconds
}

function getTestInterval(){
    const interval = document.getElementById('interval').value;
    const intervalInMilliseconds = parseInt(interval, 10);
    return intervalInMilliseconds
}

async function registerTestUser(){
    await fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: "userTest", password:"11111" }),
    }).then(response => response.json()
    ).then((data)=>{
        if(data.success && data.token){
            console.log(data.message)
            document.cookie = `token=${data.token};max-age=3600;path=/`;
        }
    })
}
async function performPostGetRequestPair(interval) {
    try {
        await fetch('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Performance-Test': 'true'
            },
            body: JSON.stringify(postData)
        }).then(()=>{
            console.log("POST");
            postCounter ++;
        });
        // add a interval between post and get
        await new Promise(resolve => setTimeout(resolve, interval));

        await fetch('/posts', {
            headers: {
                'X-Performance-Test': 'true'
            }
        }).then(()=>{
            console.log("GET");
            getCounter ++;
        });
        if (continueTest) {
            setTimeout(() => performPostGetRequestPair(interval), interval);
        }
    } catch (error) {
        console.error('Error during test:', error);
    }
}

async function startTest(interval, duration) {
    continueTest = true;
    await registerTestUser();
    autoEndTimerId = setTimeout(endPerformanceTest, duration*1000);
    await performPostGetRequestPair(interval);
}