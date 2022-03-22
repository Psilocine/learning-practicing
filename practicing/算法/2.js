const arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
/**
 * ----------- bubble ------------
 */
function bubble(arr) {
  // code here
  const len = arr.length;
  let temp;
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        temp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}
// console.log(bubble(arr));

/**
 * bubble 改进：设置标识位 pos，用于记录每次遍历中最后一次交换的位置
 * 由于 pos 位置之后的数据已交换到位，在下一次遍历无需触达
 */
function bubble2(arr) {
  // code here
  let i = arr.length - 1;
  let temp;
  while (i > 0) {
    let pos = 0;
    for (let j = 0; j < i; j++) {
      if (arr[j] > arr[j + 1]) {
        temp = arr[j + 1];
        arr[j + 1] = arr[j];
        arr[j] = temp;
        pos = j;
      }
    }
    i = pos;
  }
  return arr;
}
// console.log(bubble2(arr));

/**
 * bubble 改进：冒泡一次只找一个最大值或最小值。
 * 可以利用每趟遍历进行正向和反向两遍冒泡分别得到最小值和最大值，
 * 使次数几乎减少一半
 */
function bubble3(arr) {
  // code here
  let low = 0;
  let high = arr.length - 1;
  let temp;
  while (low < high) {
    for (let i = low; i < high; i++) {
      if (arr[i] > arr[i + 1]) {
        temp = arr[i + 1];
        arr[i + 1] = arr[i];
        arr[i] = temp;
      }
    }
    high--;
    for (let i = high; i > low; i--) {
      if (arr[i] < arr[i - 1]) {
        temp = arr[i - 1];
        arr[i - 1] = arr[i];
        arr[i] = temp;
      }
    }
    low++;
  }
  return arr;
}
// console.log(bubble3(arr));

/**
 * ----------- selection ------------
 */
function selection(arr) {
  // code here
  const len = arr.length;
  let minIndex;
  let temp;
  for (let i = 0; i < len; i++) {
    minIndex = i;
    for (let j = i; j < len; j++) {
      if (arr[minIndex] > arr[j]) {
        minIndex = j;
      }
    }
    temp = arr[minIndex];
    arr[minIndex] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

// console.log(selection(arr));

/**
 * ----------- insertion ------------
 */
function insertion(arr) {
  // code here
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    let j = i - 1;
    while (j >= 0 && item < arr[j]) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = item;
  }
  return arr;
}
// console.log(insertion(arr));

/**
 * ----------- shell ------------
 */
function shell(arr) {
  // code here
  const len = arr.length;
  let gap = Math.floor(len / 2);
  while (gap > 0) {
    for (let i = gap; i < len; i++) {
      let j = i;
      const temp = arr[i];
      while (j > 0 && temp < arr[j - gap]) {
        arr[j] = arr[j - gap];
        arr[j - gap] = temp;
        j -= gap;
      }
    }
    gap = Math.floor(gap / 2);
  }
  return arr;
}
// console.log(shell(arr));

/**
 * ----------- merge ------------
 */
function merge(arr) {
  // code here
  const len = arr.length;
  if (len < 2) return arr;
  const mid = Math.floor(len / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  return _mergeSort(merge(left), merge(right));
}

function _mergeSort(left, right) {
  // code here
  const result = [];
  while (left.length && right.length) {
    if (left[0] > right[0]) {
      result.push(right.shift());
    } else {
      result.push(left.shift());
    }
  }

  while (left.length) {
    result.push(left.shift());
  }

  while (right.length) {
    result.push(right.shift());
  }

  return result;
}
// console.log(merge(arr));

/**
 * ----------- quick ------------
 */
function quick(arr) {
  // code here
  const len = arr.length;
  if (len < 2) return arr;
  const pivotIdx = Math.floor(len / 2);
  const pivot = arr.splice(pivotIdx, 1)[0];

  const left = [];
  const right = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > pivot) {
      right.push(arr[i]);
    } else {
      left.push(arr[i]);
    }
  }

  return quick(left).concat([pivot], quick(right));
}
// console.log(quick(arr))

/**
 * ----------- heap ------------
 */
function heap(arr) {
  // code here
  const len = arr.length;

  // 1. 构建大顶堆
  for (let i = Math.floor(len / 2) - 1; i >= 0; i--) {
    heapify(arr, i, len);
  }

  // 2. 排序
  for (let j = len - 1; j >= 1; j--) {
    const temp = arr[0];
    arr[0] = arr[j];
    arr[j] = temp;
    heapify(arr, 0, j);
  }
  return arr;
}
function heapify(arr, x, length) {
  const lChild = x * 2 + 1;
  const rChild = x * 2 + 2;
  let maxIdx = x;
  if (lChild < length && arr[lChild] > arr[maxIdx]) {
    maxIdx = lChild;
  }
  if (rChild < length && arr[rChild] > arr[maxIdx]) {
    maxIdx = rChild;
  }
  // 说明位置有改变
  if (maxIdx !== x) {
    const temp = arr[x];
    arr[x] = arr[maxIdx];
    arr[maxIdx] = temp;
    heapify(arr, maxIdx, length);
  }
}
// console.log(heap(arr));

/**
 * ----------- counting ------------
 */
function counting(arr) {
  // code here
  const counts = [];
  const res = [];
  const min = Math.min(...arr);

  for (let v of arr) {
    counts[v - min] = (counts[v - min] || 0) + 1;
  }

  for (let i = 0; i < counts.length; i++) {
    let item = counts[i];
    while (item > 0) {
      res.push(i + min);
      item--;
    }
  }
  return res;
}

// console.log(counting(arr));

/**
 * ----------- bucket ------------
 */
function bucket(arr) {
  // code here
  const len = arr.length;
  if (len < 2) return arr;
  const buckets = [];
  const num = 5;
  let result = [],
    min = arr[0],
    max = arr[0];
  for (let i = 0; i < len; i++) {
    min = arr[i] > min ? min : arr[i]
    max = arr[i] < max ? max : arr[i]
  }
  const space = (max - min + 1 ) / num

  for (let j = 0; j < len; j++) {
    const index = Math.floor((arr[j] - min) / space);
    if (buckets[index]) {
      const item = buckets[index]
      let k = item.length - 1;
      while (k >= 0 && item[k] > arr[j]) {
        item[k+1] = item[k];
        k--;
      }
      item[k+1] = arr[j]
    } else {
      buckets[index] = [arr[j]]
    }
  }

  let n = 0;
  while(n < num) {
    if (buckets[n]) result = result.concat(buckets[n])
    n++;
  }

  return result;
}
// console.log(bucket(arr));

/**
 * ----------- Radix ------------
 */
/**
 * @param {*} maxDigit 最大位数
 */
function radix(arr, maxDigit) {
  // code here
  for (let i = 0; i < maxDigit; i++) {
    arr = sort(arr, i)
  }

  function sort (array, index) {
    let buckets = [];
    for (let i = 0; i < 10; i++) {
      buckets.push([])
    }

    for (let v of array) {
      let pad = String(v).padStart(maxDigit, "0");
      let num = pad[maxDigit - 1- index];
      buckets[num].push(v)
    }
    const result = [];
    for (let bucket of buckets) {
      result.push(...bucket)
    }
    return result;
  }
  return arr;
}
// console.log(radix(arr, 2));
