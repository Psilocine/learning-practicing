const arr = [3, 44, 38, 5, 47, 15, 36, 26, 27, 2, 46, 4, 19, 50, 48];
/**
 * ----------- bubble ------------
 */
function bubble(arr) {
  // code here
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - 1 - i; j++) {
      if (arr[j + 1] < arr[j]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
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
  let pos;
  for (let i = arr.length - 1; i > 0; ) {
    pos = 0;
    for (let j = 0; j < i; j++) {
      if (arr[j + 1] < arr[j]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
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

  while (low < high) {
    for (let i = low; i < high; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      }
    }
    high--;

    for (let i = high; i > low; i--) {
      if (arr[i] < arr[i - 1]) {
        [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
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
  for (let i = 0; i < arr.length; i++) {
    let min = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[min]) {
        min = j;
      }
    }
    [arr[i], arr[min]] = [arr[min], arr[i]];
  }

  return arr;
}
// console.log(selection(arr));

/**
 * ----------- insertion ------------
 */
function insertion(arr) {
  // code here
  for (let i = 1; i < arr.length; i++) {
    const item = arr[i];
    let j = i - 1;
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
  let gap = Math.floor(arr.length / 2);

  while(gap > 0) {
    for (let i = gap; i < arr.length; i++) {
      let j = i;
      const temp = arr[i];

      while(j > 0 && arr[j - gap] > temp) {
        arr[j] = arr[j - gap]
        arr[j - gap] = temp;
        j -= gap;
      }
    }

    gap = Math.floor(gap / 2)
  }

  return arr;
}
// console.log(shell(arr));

/**
 * ----------- merge ------------
 */
function merge(arr) {
  // code here
  let len = arr.length;
  if (len < 2) return arr;

  const mid = Math.floor(len / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);

  return _mergeSort(merge(left), merge(right))
}

function _mergeSort(left, right) {
  // code here
  const arr = []

  while(left.length && right.length) {
    if (left[0] <= right[0]) {
      arr.push(left.shift())
    } else {
      arr.push(right.shift())
    }
  }
  while(left.length)  {
    arr.push(left.shift())
  }

  while (right.length) {
    arr.push(right.shift());
  }
  return arr
}
// console.log(merge(arr));

/**
 * ----------- quick ------------
 */
function quick(arr) {
  // code here
  if (arr.length < 2) return arr;

  let index = Math.floor(arr.length  / 2);
  const pivot = arr.splice(index, 1)[0];

  const left = []
  const right = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i])
    } else {
      right.push(arr[i])
    }
  }
  

  return quick(left).concat(pivot, quick(right));
}
// console.log(quick(arr))

/**
 * ----------- heap ------------
 */
function heap(arr) {
  // code here
}
function heapify(arr, x, length) {}
// console.log(heap(arr));

/**
 * ----------- counting ------------
 */
function counting(arr) {
  // code here
}

// console.log(counting(arr));

/**
 * ----------- bucket ------------
 */
function bucket(arr) {
  // code here
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
}
// console.log(radix(arr, 2));
