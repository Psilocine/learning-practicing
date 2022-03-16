const arr = [50, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
/**
 * ----------- bubble ------------
 */
function bubble(arr) {
  // code here
  const len = arr.length;
  let temp;
  for (let i = 0; i < len; i++) {
    // 相邻的两个数比较，倒二位和最后一位比较，即 len - 1
    // 每次循环把最大值冒泡到数组末尾，因此已完成循环的数组末尾可以不参与，即 len - 1 - i
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
  let pos;
  let temp;
  while (i > 0) {
    pos = 0; // 重置
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
  // 双指针
  while (low < high) {
    for (let i = low; i < high; i++) {
      if (arr[i] > arr[i + 1]) {
        temp = arr[i + 1];
        arr[i + 1] = arr[i];
        arr[i] = temp;
      }
    }
    high--;
    for (let j = high; j > low; j--) {
      if (arr[j] < arr[j - 1]) {
        temp = arr[j - 1];
        arr[j - 1] = arr[j];
        arr[j] = temp;
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
  let len = arr.length;
  let temp;
  let minIdx;
  for (let i = 0; i < len; i++) {
    minIdx = i;
    // 每次循环把最小值排与数组首部，所以要把有序序列排除，即 j = i + 1
    for (let j = i + 1; j < len; j++) {
      if (arr[j] < arr[minIdx]) {
        minIdx = j; // 发现无序序列最小的索引
      }
    }
    temp = arr[minIdx];
    arr[minIdx] = arr[i];
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
  const len = arr.length;
  for (let i = 1; i < len; i++) {
    const item = arr[i];
    let j = i - 1;
    // 从有序序列的尾部开始循环对比
    while (j >= 0 && arr[j] > item) {
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
      while (j > 0 && arr[j - gap] > temp) {
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
  if (arr.length < 2) return arr;
  // code here
  const mid = Math.floor(arr.length / 2);
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
  if (arr.length < 2) return arr;
  const pivotIdx = Math.floor(arr.length / 2);
  const pivot = arr.splice(pivotIdx, 1)[0]; // 基准点

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
// console.log(quick(arr));

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
  // code here
  const lChild = x * 2 + 1;
  const rChild = x * 2 + 2;
  let maxIdx = x;
  if (lChild < length && arr[maxIdx] < arr[lChild]) {
    maxIdx = lChild;
  }
  if (rChild < length && arr[maxIdx] < arr[rChild]) {
    maxIdx = rChild;
  }

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
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    counts[item - min] = (counts[item - min] || 0) + 1;
  }

  for (let i = 0; i < counts.length; i++) {
    let count = counts[i];
    while (count > 0) {
      res.push(i + min);
      count--;
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
  if (arr.length < 2) return arr;
  const buckets = [];
  const num = 5;
  let result = [];
  let min = arr[0];
  let max = arr[0];
  for (let i = 0; i < arr.length; i++) {
    min = arr[i] < min ? arr[i] : min;
    max = arr[i] > max ? arr[i] : max;
  }

  const space = (max - min + 1) / num;

  for (let j = 0; j < arr.length; j++) {
    const index = Math.floor((arr[j] - min) / space);
    if (buckets[index]) {
      let k = buckets[index].length - 1;
      while (k >= 0 && buckets[index][k] > arr[j]) {
        buckets[index][k + 1] = buckets[index][k];
        k--;
      }
      buckets[index][k + 1] = arr[j];
    } else {
      buckets[index] = [arr[j]];
    }
  }

  let n = 0;
  while (n < num) {
    if (buckets[n]) result = result.concat(buckets[n]);
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
    arr = sort(arr, i);
  }

  function sort(array, index) {
    let buckets = [];
    for (let i = 0; i < 10; i++) {
      buckets.push([]);
    }

    for (let v of array) {
      let pad = String(v).padStart(maxDigit, "0");
      let num = pad[maxDigit - 1 - index];
      buckets[num].push(v);
    }

    const result = [];
    for (let bucket of buckets) {
      result.push(...bucket);
    }
    return result;
  }
  return arr;
}
// console.log(radix(arr, 2));
