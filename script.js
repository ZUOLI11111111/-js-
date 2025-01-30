const dailyTasks = [
    { time: '09:00-09:30', task: '起床' },
    { time: '09:30-10:00', task: '洗漱' },
    { time: '10:00-10:30', task: '复习公司金融' },
    { time: '11:00-11:30', task: '复习宏观经济学' },
    { time: '11:30-12:30', task: '金融学刷题' },
    { time: '14:00-16:00', task: '学习JavaWeb' },
    { time: '16:00-18:00', task: '扩充技术栈' },
    { time: '20:00-21:00', task: '刷LeetCode (3题)' }
];

const startDate = new Date('2024-01-15');
const endDate = new Date('2024-02-14');
let currentDate = new Date(startDate);

// Load saved data from localStorage
const loadSavedData = () => {
    const savedData = localStorage.getItem('todoData');
    return savedData ? JSON.parse(savedData) : {};
};

// Save data to localStorage
const saveData = (data) => {
    localStorage.setItem('todoData', JSON.stringify(data));
};

// Export data to file
const exportData = () => {
    const data = JSON.stringify(todoData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todo-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// Import data from file
const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                todoData = importedData;
                saveData(todoData);
                updateTodoList();
                alert('数据导入成功！');
            } catch (error) {
                alert('导入失败：无效的数据格式');
            }
        };
        reader.readAsText(file);
    }
};

let todoData = loadSavedData();

const formatDate = (date) => {
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
};

const updateTodoList = () => {
    const todoList = document.getElementById('todoList');
    const dateString = currentDate.toISOString().split('T')[0];
    const currentTodoData = todoData[dateString] || {};

    todoList.innerHTML = '';
    
    // Add data management buttons
    const dataManagement = document.createElement('div');
    dataManagement.className = 'data-management';
    dataManagement.innerHTML = `
        <button onclick="exportData()" class="data-btn">导出数据</button>
        <label class="data-btn">
            导入数据
            <input type="file" accept=".json" onchange="importData(event)" style="display: none;">
        </label>
    `;
    todoList.appendChild(dataManagement);

    dailyTasks.forEach((task, index) => {
        const isCompleted = currentTodoData[index] || false;
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        todoItem.innerHTML = `
            <span class="time">${task.time}</span>
            <span class="task ${isCompleted ? 'completed' : ''}">${task.task}</span>
            <input type="checkbox" class="checkbox" ${isCompleted ? 'checked' : ''} 
                   onchange="toggleTask(${index})">
        `;
        todoList.appendChild(todoItem);
    });

    document.getElementById('currentDate').textContent = formatDate(currentDate);
};

const toggleTask = (index) => {
    const dateString = currentDate.toISOString().split('T')[0];
    if (!todoData[dateString]) {
        todoData[dateString] = {};
    }
    todoData[dateString][index] = !todoData[dateString][index];
    saveData(todoData);
    updateTodoList();
};

document.getElementById('prevDate').addEventListener('click', () => {
    if (currentDate > startDate) {
        currentDate.setDate(currentDate.getDate() - 1);
        updateTodoList();
    }
});

document.getElementById('nextDate').addEventListener('click', () => {
    if (currentDate < endDate) {
        currentDate.setDate(currentDate.getDate() + 1);
        updateTodoList();
    }
});

// Initialize the todo list
updateTodoList(); 