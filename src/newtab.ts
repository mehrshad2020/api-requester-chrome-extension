// اسکریپت برای API Requester

document.addEventListener('DOMContentLoaded', () => {
  // عناصر فرم
  const requestForm = document.getElementById('requestForm') as HTMLFormElement;
  const methodSelect = document.getElementById('method') as HTMLSelectElement;
  const urlInput = document.getElementById('url') as HTMLInputElement;
  const bodyContainer = document.getElementById('bodyContainer') as HTMLDivElement;
  const requestBodyTextarea = document.getElementById('requestBody') as HTMLTextAreaElement;
  const loadingElement = document.getElementById('loading') as HTMLDivElement;
  const responseSection = document.getElementById('responseSection') as HTMLDivElement;
  const responseStatus = document.getElementById('responseStatus') as HTMLSpanElement;
  const responseTime = document.getElementById('responseTime') as HTMLSpanElement;
  const responseBody = document.getElementById('responseBody') as HTMLPreElement;
  const headersTableBody = document.getElementById('headersTableBody') as HTMLTableSectionElement;
  
  // دکمه‌های افزودن هدر و پارامتر
  const addHeaderBtn = document.getElementById('addHeaderBtn') as HTMLButtonElement;
  const addParamBtn = document.getElementById('addParamBtn') as HTMLButtonElement;
  const headersList = document.getElementById('headersList') as HTMLDivElement;
  const paramsList = document.getElementById('paramsList') as HTMLDivElement;

  // زبانه‌های پاسخ
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  // تغییر وضعیت نمایش فیلد محتوای درخواست بر اساس روش انتخاب شده
  methodSelect.addEventListener('change', () => {
    const method = methodSelect.value;
    bodyContainer.style.display = (method === 'GET' || method === 'DELETE') ? 'none' : 'block';
  });

  // مدیریت زبانه‌های پاسخ
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // فعال کردن زبانه کلیک شده
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // نمایش محتوای مربوط به زبانه
      const tabId = tab.getAttribute('data-tab');
      tabContents.forEach(content => content.classList.remove('active'));
      document.getElementById(`${tabId}Tab`)?.classList.add('active');
    });
  });

  // افزودن هدر جدید
  addHeaderBtn.addEventListener('click', () => {
    const headerGroup = createParamGroup('header');
    headersList.appendChild(headerGroup);
  });

  // افزودن پارامتر جدید
  addParamBtn.addEventListener('click', () => {
    const paramGroup = createParamGroup('param');
    paramsList.appendChild(paramGroup);
  });

  // ایجاد گروه پارامتر یا هدر
  function createParamGroup(type: 'header' | 'param'): HTMLDivElement {
    const group = document.createElement('div');
    group.className = 'param-group';
    
    const nameInput = document.createElement('div');
    nameInput.className = 'param-input';
    const nameField = document.createElement('input');
    nameField.type = 'text';
    nameField.placeholder = 'نام';
    nameField.className = type === 'header' ? 'header-name' : 'param-name';
    nameInput.appendChild(nameField);
    
    const valueInput = document.createElement('div');
    valueInput.className = 'param-input';
    const valueField = document.createElement('input');
    valueField.type = 'text';
    valueField.placeholder = 'مقدار';
    valueField.className = type === 'header' ? 'header-value' : 'param-value';
    valueInput.appendChild(valueField);
    
    const actions = document.createElement('div');
    actions.className = 'param-actions';
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'action-button remove-param';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
      group.remove();
    });
    actions.appendChild(removeBtn);
    
    group.appendChild(nameInput);
    group.appendChild(valueInput);
    group.appendChild(actions);
    
    return group;
  }

  // حذف دکمه‌های حذف در اولین ردیف پارامترها
  document.querySelectorAll('.remove-param').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const group = (e.target as HTMLElement).closest('.param-group');
      if (group) {
        group.remove();
      }
    });
  });

  // ارسال درخواست
  requestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // جمع‌آوری اطلاعات درخواست
    const method = methodSelect.value;
    let url = urlInput.value.trim();
    
    if (!url) {
      showError('لطفاً آدرس درخواست را وارد کنید');
      return;
    }
    
    try {
      // جمع‌آوری پارامترها
      const params = collectParams();
      if (params.length > 0) {
        // اضافه کردن پارامترها به URL
        const urlObj = new URL(url);
        params.forEach(param => {
          if (param.name && param.value) {
            urlObj.searchParams.append(param.name, param.value);
          }
        });
        url = urlObj.toString();
      }
      
      // جمع‌آوری هدرها
      const headers = collectHeaders();
      
      // تنظیم محتوای درخواست
      let body = undefined;
      if (method !== 'GET' && method !== 'DELETE' && bodyContainer.style.display !== 'none') {
        const bodyText = requestBodyTextarea.value.trim();
        if (bodyText) {
          try {
            body = JSON.parse(bodyText);
          } catch (error) {
            showError('محتوای JSON نامعتبر است');
            return;
          }
        }
      }
      
      // نمایش حالت در حال بارگیری
      loadingElement.style.display = 'block';
      responseSection.style.display = 'none';
      
      // زمان شروع درخواست
      const startTime = Date.now();
      
      // ارسال درخواست
      const response = await sendRequest(method, url, headers, body);
      
      // زمان پایان درخواست
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // نمایش نتیجه
      displayResponse(response, duration);
      
    } catch (error) {
      showError(`خطا در ارسال درخواست: ${(error as Error).message}`);
      loadingElement.style.display = 'none';
    }
  });

  // جمع‌آوری هدرها
  function collectHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    const headerElements = headersList.querySelectorAll('.param-group');
    
    headerElements.forEach(element => {
      const nameInput = element.querySelector('.header-name') as HTMLInputElement;
      const valueInput = element.querySelector('.header-value') as HTMLInputElement;
      
      const name = nameInput?.value.trim();
      const value = valueInput?.value.trim();
      
      if (name && value) {
        headers[name] = value;
      }
    });
    
    return headers;
  }

  // جمع‌آوری پارامترها
  function collectParams(): Array<{ name: string, value: string }> {
    const params: Array<{ name: string, value: string }> = [];
    const paramElements = paramsList.querySelectorAll('.param-group');
    
    paramElements.forEach(element => {
      const nameInput = element.querySelector('.param-name') as HTMLInputElement;
      const valueInput = element.querySelector('.param-value') as HTMLInputElement;
      
      const name = nameInput?.value.trim();
      const value = valueInput?.value.trim();
      
      if (name || value) {
        params.push({ name: name || '', value: value || '' });
      }
    });
    
    return params;
  }

  // ارسال درخواست
  async function sendRequest(
    method: string,
    url: string,
    headers: Record<string, string>,
    body?: any
  ): Promise<Response> {
    const options: RequestInit = {
      method,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    return fetch(url, options);
  }

  // نمایش پاسخ
  async function displayResponse(response: Response, duration: number) {
    try {
      loadingElement.style.display = 'none';
      responseSection.style.display = 'block';
      
      // وضعیت پاسخ
      responseStatus.textContent = `${response.status} ${response.statusText}`;
      responseTime.textContent = `${duration} ms`;
      
      // هدرهای پاسخ
      headersTableBody.innerHTML = '';
      response.headers.forEach((value, name) => {
        const row = document.createElement('tr');
        
        const nameCell = document.createElement('td');
        nameCell.textContent = name;
        row.appendChild(nameCell);
        
        const valueCell = document.createElement('td');
        valueCell.textContent = value;
        row.appendChild(valueCell);
        
        headersTableBody.appendChild(row);
      });
      
      // محتوای پاسخ
      try {
        // سعی در تبدیل به JSON
        const json = await response.json();
        responseBody.textContent = JSON.stringify(json, null, 2);
      } catch {
        // اگر JSON نبود، به صورت متن نمایش بده
        const text = await response.text();
        responseBody.textContent = text;
      }
      
      // نمایش زبانه محتوا
      document.querySelector('.tab[data-tab="body"]')?.dispatchEvent(new Event('click'));
    } catch (error) {
      showError(`خطا در پردازش پاسخ: ${(error as Error).message}`);
    }
  }

  // نمایش خطا
  function showError(message: string) {
    // اگر قبلاً خطایی وجود دارد، آن را حذف کن
    const existingError = document.querySelector('.error');
    if (existingError) {
      existingError.remove();
    }
    
    // ایجاد عنصر خطا
    const error = document.createElement('div');
    error.className = 'error';
    error.textContent = message;
    
    // نمایش خطا بعد از فرم
    requestForm.appendChild(error);
    
    // حذف خطا بعد از 5 ثانیه
    setTimeout(() => {
      error.remove();
    }, 5000);
  }

  // تنظیم ابتدایی
  methodSelect.dispatchEvent(new Event('change'));
}); 