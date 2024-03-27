const postData = {
    username: "userTest", 
    user_id: 1,
    status: "OK",
    dateTime: new Date().toLocaleString(),
    content: "testmessage20charrrrr"
  };

let continueTest = false;

let postDuration;
let getDuration;

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
            'X-Performance-Test': 'true'
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

async function performPostRequests(interval, duration) {
    const postStartTime = Date.now();
    postDuration = 0;

    while (continueTest && postDuration < duration) {
        await fetch('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Performance-Test': 'true'
            },
            body: JSON.stringify(postData)
        });
        console.log('POST');
        postCounter++;
        await new Promise(resolve => setTimeout(resolve, interval));
        postDuration = (Date.now() - postStartTime) / 1000;
        if (postCounter > 1000){
            continueTest = false;
        }
    }
    console.log('POST requests completed');
}

async function performGetRequests(interval, duration) {
    const getStartTime = Date.now();
    getDuration = 0;

    while (continueTest && getDuration < duration) {
        await fetch('/posts', {
            headers: {
                'X-Performance-Test': 'true'
            }
        });
        console.log('GET');
        getCounter++;
        await new Promise(resolve => setTimeout(resolve, interval));
        getDuration = (Date.now() - getStartTime) / 1000;
    }
    console.log('GET requests completed');
    if (continueTest){
        await endPerformanceTest();
    }
}



async function startTest(interval, duration) {
    continueTest = true;
    await registerTestUser();
    await performPostRequests(interval, duration / 2);
    await performGetRequests(interval, duration / 2);
}

async function endPerformanceTest() {
    continueTest = false;
    let getSpeed = getCounter / getDuration;
    let postSpeed = postCounter / postDuration;
    await fetch('/test/performance/end', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'X-Performance-Test': 'true'
        }
    })
    .then(response => response.json())
    .then(() => {
        console.log(postCounter)
        console.log(postDuration)
        if (postCounter > 998){
            console.log(`test stop becasue it reach the 1000 limit of post request\nThe speed of post request is ${postSpeed}/second`)
        }
        alert(`The speed of get is ${getSpeed}/ second \nThe speed of post is ${postSpeed}/second`)
    })
    .catch(error => alert('Error ending performance test'));
}