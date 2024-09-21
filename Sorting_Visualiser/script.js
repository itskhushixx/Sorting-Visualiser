document.addEventListener('DOMContentLoaded', () => {
    const arrayInput = document.getElementById('arrayInput');
    const bubbleSortBtn = document.getElementById('bubbleSortBtn');
    const quickSortBtn = document.getElementById('quickSortBtn');
    const mergeSortBtn = document.getElementById('mergeSortBtn');
    const selectionSortBtn = document.getElementById('selectionSortBtn');
    const insertionSortBtn = document.getElementById('insertionSortBtn');
    const heapSortBtn = document.getElementById('heapSortBtn');
    const stopBtn = document.getElementById('stopBtn');
    const clearBtn = document.getElementById('clearBtn');
    const visualization = document.getElementById('visualization');
    const sortingNameElement = document.getElementById('sortingName'); // Element for sorting name
    const visualizationHeight = 300; // The height of the visualization area
    let isRunning = false; // To track whether sorting is in progress
    let timeouts = []; // To store the timeouts
    bubbleSortBtn.addEventListener('click', () => {
        if (!isRunning) {
            startSorting(bubbleSort,"Bubble Sort");
        }
    });

    quickSortBtn.addEventListener('click', () => {
        if (!isRunning) {
            startSorting(quickSort,"Quick Sort");
        }
    });

    mergeSortBtn.addEventListener('click', () => {
        if (!isRunning) {
            startSorting(mergeSort,"Merge Sort");
        }
    });

    selectionSortBtn.addEventListener('click', () => {
        if (!isRunning) {
            startSorting(selectionSort,"Selection Sort");
        }
    });

    insertionSortBtn.addEventListener('click', () => {
        if (!isRunning) {
            startSorting(insertionSort,"Insertion Sort");
        }
    });

    heapSortBtn.addEventListener('click', () => {
        if (!isRunning) {
            startSorting(heapSort,"Heap Sort");
        }
    });

    stopBtn.addEventListener('click', () => {
        stopSorting();
    });

    clearBtn.addEventListener('click', () => {
        clearVisualization();
    });

    function validateInput(input) {
        // Split the input by commas and trim any extra spaces
        const values = input.split(',').map(value => value.trim());
        // Check if all values are non-empty and numeric
        return values.every(value => !isNaN(value) && value !== '');
    }

    function startSorting(sortFunction, name) {
        const input = arrayInput.value;
        if (!validateInput(input)) {
            alert('Please enter valid numbers separated by commas.');
            return;
        }
        
        const array = arrayInput.value.split(',').map(Number);
        const steps = sortFunction(array);
        sortingNameElement.textContent = name; // Set the sorting name
        isRunning = true;
        visualizeSorting(steps, Math.max(...array), Math.min(...array));
    }


    function visualizeSorting(steps, maxValue, minValue) {
        steps.forEach((step, index) => {
            const timeout = setTimeout(() => {
                if (!isRunning) return;
                visualization.innerHTML = '';
                step.forEach(value => {
                    const bar = document.createElement('div');
                    bar.className = 'bar';
                    bar.style.height = (value / maxValue) * visualizationHeight + 'px'; // Scale height relative to max value

                    // Assign colors based on size comparison
                    if (value >= minValue * 3) {
                        bar.classList.add('red');
                    } else if (value >= minValue * 2) {
                        bar.classList.add('yellow');
                    } else {
                        bar.classList.add('green');
                    }

                    // Add a label to the bar
                    const label = document.createElement('span');
                    label.className = 'bar-label';
                    label.innerText = value;
                    bar.appendChild(label);

                    visualization.appendChild(bar);
                });
            }, index * 500); // Adjust the delay as needed
            timeouts.push(timeout);
        });
    }

  function stopSorting() {
        isRunning = false;
        timeouts.forEach(timeout => clearTimeout(timeout));
        timeouts = [];
    }

    function clearVisualization() {
        visualization.innerHTML = '';
        sortingNameElement.textContent = ''; // Reset the sorting name
    }

    function bubbleSort(array) {
        const steps = [];
        const n = array.length;
        const arr = [...array];

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    const temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    steps.push([...arr]);
                }
            }
        }
        return steps;
    }

    function quickSort(array) {
        const steps = [];
        const arr = [...array];
        quickSortHelper(arr, 0, arr.length - 1, steps);
        return steps;
    }

    function quickSortHelper(arr, low, high, steps) {
        if (low < high) {
            const pi = partition(arr, low, high, steps);
            quickSortHelper(arr, low, pi - 1, steps);
            quickSortHelper(arr, pi + 1, high, steps);
        }
    }

    function partition(arr, low, high, steps) {
        const pivot = arr[high];
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                const temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                steps.push([...arr]);
            }
        }

        const temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        steps.push([...arr]);

        return i + 1;
    }

    function mergeSort(array) {
        const steps = [];
        const arr = [...array];
        mergeSortHelper(arr, 0, arr.length - 1, steps);
        return steps;
    }

    function mergeSortHelper(arr, left, right, steps) {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            mergeSortHelper(arr, left, mid, steps);
            mergeSortHelper(arr, mid + 1, right, steps);
            merge(arr, left, mid, right, steps);
        }
    }

    function merge(arr, left, mid, right, steps) {
        const n1 = mid - left + 1;
        const n2 = right - mid;
        const L = [];
        const R = [];

        for (let i = 0; i < n1; i++) {
            L[i] = arr[left + i];
        }
        for (let j = 0; j < n2; j++) {
            R[j] = arr[mid + 1 + j];
        }

        let i = 0;
        let j = 0;
        let k = left;

        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }

        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }

        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }

        steps.push([...arr]);
    }

    function selectionSort(array) {
        const steps = [];
        const arr = [...array];
        const n = arr.length;

        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;

            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }

            const temp = arr[minIndex];
            arr[minIndex] = arr[i];
            arr[i] = temp;

            steps.push([...arr]);
        }
        return steps;
    }

    function insertionSort(array) {
        const steps = [];
        const arr = [...array];
        const n = arr.length;

        for (let i = 1; i < n; i++) {
            const key = arr[i];
            let j = i - 1;

            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = key;
            steps.push([...arr]);
        }
        return steps;
    }

    function heapSort(array) {
        const steps = [];
        const arr = [...array];
        const n = arr.length;

        buildMaxHeap(arr, n, steps);

        for (let i = n - 1; i > 0; i--) {
            const temp = arr[0];
            arr[0] = arr[i];
            arr[i] = temp;

            heapify(arr, 0, i, steps);
        }

        return steps;
    }

    function buildMaxHeap(arr, n, steps) {
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(arr, i, n, steps);
        }
    }

    function heapify(arr, i, n, steps) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }

        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest !== i) {
            const temp = arr[i];
            arr[i] = arr[largest];
            arr[largest] = temp;

            steps.push([...arr]);

            heapify(arr, largest, n, steps);
        }
    }
});
