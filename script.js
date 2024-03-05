document.getElementById('sortButton').addEventListener('click', () => {
    const inputArray = document.getElementById('inputArray').value
    .split(',')
    .map(num => parseInt(num.trim()));
    
    const selectedAlgorithm = document.getElementById('sortingAlgorithm').value;
    
    // Call the sorting function based on the selected algorithm
    const [sortedArray, swaps] = sortWithAlgorithm(selectedAlgorithm, inputArray.slice());
    
    visualizeSorting(sortedArray);
    document.getElementById('swapCount').textContent = `Swaps: ${swaps}`;
});

// Function to sort based on the selected algorithm
function sortWithAlgorithm(algorithm, arr) {
    switch (algorithm) {
        case 'bubbleSort':
            return bubbleSort(arr);
        case 'selectionSort':
            return selectionSort(arr);
        case 'insertionSort':
            return insertionSort(arr);
        case 'quickSort':
            return quickSort(arr);
        case 'mergeSort':
            return mergeSort(arr);
        case 'radixSort':
            return radixSort(arr);
        case 'countingSort':
            return countingSort(arr);
        case 'bucketSort':
            return bucketSort(arr);
        default:
            return [arr, 0]; // Default to no sorting if algorithm is not recognized
    }
}

function bubbleSort(arr) {
    let swaps = 0;

    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - 1 - i; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swaps++;
            }
        }
    }

    return [arr, swaps];
}

function selectionSort(arr) {
    let swaps = 0;

    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i;

        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }

        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            swaps++;
        }
    }

    return [arr, swaps];
}

function insertionSort(arr) {
    let swaps = 0;

    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
            swaps++;
        }

        arr[j + 1] = key;
    }

    return [arr, swaps];
}

function quickSort(arr) {
    if (arr.length <= 1) {
        return [arr, 0];
    }

    const pivot = arr[0];
    const left = [];
    const right = [];
    let swaps = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
        swaps++;
    }

    const [leftSorted, leftSwaps] = quickSort(left);
    const [rightSorted, rightSwaps] = quickSort(right);

    const sortedArray = leftSorted.concat(pivot, rightSorted);
    swaps += leftSwaps + rightSwaps;

    return [sortedArray, swaps];
}
function mergeSort(arr){
    function merge(left, right) {
        let result = [];
        let swaps = 0;

        while (left.length && right.length) {
            if (left[0] <= right[0]) {
                result.push(left.shift());
            } else {
                result.push(right.shift());
                swaps++;
            }
        }

        return [result.concat(left), result.concat(right), swaps];
    }

    if (arr.length <= 1) {
        return [arr, 0];
    }

    const middle = Math.floor(arr.length / 2);
    const left = arr.slice(0, middle);
    const right = arr.slice(middle);

    const [leftSorted, leftSwaps] = mergeSort(left);
    const [rightSorted, rightSwaps] = mergeSort(right);
    const [sortedArray, mergeSwaps] = merge(leftSorted, rightSorted);

    const totalSwaps = leftSwaps + rightSwaps + mergeSwaps;

    return [sortedArray, totalSwaps];
}

function getMax(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

function countSort(arr, exp) {
    const n = arr.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);
    let swaps = 0;

    for (let i = 0; i < n; i++) {
        count[Math.floor(arr[i] / exp) % 10]++;
    }

    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    for (let i = n - 1; i >= 0; i--) {
        output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
        count[Math.floor(arr[i] / exp) % 10]--;
        swaps++;
    }

    for (let i = 0; i < n; i++) {
        arr[i] = output[i];
    }

    return [arr, swaps];
}

function radixSort(arr) {
    const max = getMax(arr);
    let exp = 1;
    let swaps = 0;

    for (; max / exp > 0; exp *= 10) {
        [arr, expSwaps] = countSort(arr, exp);
        swaps += expSwaps;
    }

    return [arr, swaps];
}

function countingSort(arr) {
    const n = arr.length;
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const output = new Array(n);
    let swaps = 0;

    for (let i = 0; i < n; i++) {
        count[arr[i] - min]++;
    }

    for (let i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }

    for (let i = n - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
        swaps++;
    }

    for (let i = 0; i < n; i++) {
        arr[i] = output[i];
    }

    return [arr, swaps];
}

function bucketSort(arr) {
    const n = arr.length;
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const bucketSize = 5; // You can adjust the bucket size

    const bucketCount = Math.floor((max - min) / bucketSize) + 1;
    const buckets = new Array(bucketCount);

    for (let i = 0; i < bucketCount; i++) {
        buckets[i] = [];
    }

    for (let i = 0; i < n; i++) {
        const index = Math.floor((arr[i] - min) / bucketSize);
        buckets[index].push(arr[i]);
    }

    const sortedArray = [];
    let swaps = 0;

    for (let i = 0; i < bucketCount; i++) {
        [buckets[i], bucketSwaps] = bubbleSort(buckets[i]); // You can use any sorting algorithm for the buckets
        sortedArray.push(...buckets[i]);
        swaps += bucketSwaps;
    }

    return [sortedArray, swaps];
}




// // Function to visualize sorting with bars
// function visualizeSorting(sortedArray) {
//     const visualizationDiv = document.getElementById('visualization');
//     visualizationDiv.innerHTML = ''; // Clear the previous visualization
//     const maxVal = Math.max(...sortedArray);
//     const barWidth = 20;
//     const barMargin = 1;

//     for (let i = 0; i < sortedArray.length; i++) {
//         const bar = document.createElement('div');
//         bar.className = 'bar';
//         bar.style.height = `${(sortedArray[i] / maxVal) * 100}%`;
//         bar.style.width = `${barWidth}px`;
//         bar.style.left = `${i * (barWidth + barMargin)}px`;
//         visualizationDiv.appendChild(bar);
//     }
// }









// Function to simulate a delay for animations
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
}

// Function to animate the sorting process
async function visualizeSorting(sortedArray, swaps) {
    const visualizationDiv = document.getElementById('visualization');
    visualizationDiv.innerHTML = ''; // Clear the previous visualization
    const maxVal = Math.max(...sortedArray);
    const barWidth = 20;
    const barMargin = 1;

    for (let i = 0; i < sortedArray.length; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${(sortedArray[i] / maxVal) * 100}%`;
        bar.style.width = `${barWidth}px`;
        bar.style.left = `${i * (barWidth + barMargin)}px`;
        visualizationDiv.appendChild(bar);
    }

    // Visualize the sorting with animations
    for (let i = 0; i < swaps; i++) {
        for (let j = 0; j < sortedArray.length - i - 1; j++) {
            // Highlight the bars being compared
            visualizationDiv.children[j].style.backgroundColor = 'red';
            visualizationDiv.children[j + 1].style.backgroundColor = 'red';

            await sleep(100); // Adjust the animation speed here (e.g., 100ms)

            if (sortedArray[j] > sortedArray[j + 1]) {
                [sortedArray[j], sortedArray[j + 1]] = [sortedArray[j + 1], sortedArray[j]];
            }

            // Update the heights of bars
            visualizationDiv.children[j].style.height = `${(sortedArray[j] / maxVal) * 100}%`;
            visualizationDiv.children[j + 1].style.height = `${(sortedArray[j + 1] / maxVal) * 100}%`;

            // Reset the color
            visualizationDiv.children[j].style.backgroundColor = '#3498db';
            visualizationDiv.children[j + 1].style.backgroundColor = '#3498db';

            await sleep(100); // Adjust the animation speed here (e.g., 100ms)
        }
    }
}
