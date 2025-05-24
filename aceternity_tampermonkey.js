// ==UserScript==
// @name         Aceternity UI 组件数据爬取器 (修正版)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  爬取 Aceternity UI 组件信息并生成 JSON 数据
// @author       Assistant
// @match        https://ui.aceternity.com/components/*
// @grant        GM_setClipboard
// @grant        GM_download
// ==/UserScript==

(function () {
    'use strict';

    // 所有组件 URL 列表 这里其实可以循环获取得到componentUrls 我直接通过console qureySelect copy的
    const componentUrls = [
        "https://ui.aceternity.com/components/3d-card-effect",
        "https://ui.aceternity.com/components/3d-marquee",
        "https://ui.aceternity.com/components/3d-pin",
        "https://ui.aceternity.com/components/animated-modal",
        "https://ui.aceternity.com/components/animated-testimonials",
        "https://ui.aceternity.com/components/animated-tooltip",
        "https://ui.aceternity.com/components/apple-cards-carousel",
        "https://ui.aceternity.com/components/aurora-background",
        "https://ui.aceternity.com/components/background-beams",
        "https://ui.aceternity.com/components/background-beams-with-collision",
        "https://ui.aceternity.com/components/background-boxes",
        "https://ui.aceternity.com/components/background-gradient",
        "https://ui.aceternity.com/components/background-lines",
        "https://ui.aceternity.com/components/bento-grid",
        "https://ui.aceternity.com/components/canvas-reveal-effect",
        "https://ui.aceternity.com/components/card-hover-effect",
        "https://ui.aceternity.com/components/card-spotlight",
        "https://ui.aceternity.com/components/card-stack",
        "https://ui.aceternity.com/components/cards",
        "https://ui.aceternity.com/components/carousel",
        "https://ui.aceternity.com/components/code-block",
        "https://ui.aceternity.com/components/colourful-text",
        "https://ui.aceternity.com/components/compare",
        "https://ui.aceternity.com/components/container-cover",
        "https://ui.aceternity.com/components/container-scroll-animation",
        "https://ui.aceternity.com/components/container-text-flip",
        "https://ui.aceternity.com/components/direction-aware-hover",
        "https://ui.aceternity.com/components/draggable-card",
        "https://ui.aceternity.com/components/evervault-card",
        "https://ui.aceternity.com/components/expandable-card",
        "https://ui.aceternity.com/components/feature-sections",
        "https://ui.aceternity.com/components/file-upload",
        "https://ui.aceternity.com/components/flip-words",
        "https://ui.aceternity.com/components/floating-dock",
        "https://ui.aceternity.com/components/floating-navbar",
        "https://ui.aceternity.com/components/focus-cards",
        "https://ui.aceternity.com/components/following-pointer",
        "https://ui.aceternity.com/components/github-globe",
        "https://ui.aceternity.com/components/glare-card",
        "https://ui.aceternity.com/components/glowing-effect",
        "https://ui.aceternity.com/components/glowing-stars-effect",
        "https://ui.aceternity.com/components/google-gemini-effect",
        "https://ui.aceternity.com/components/background-gradient-animation",
        "https://ui.aceternity.com/components/grid-and-dot-backgrounds",
        "https://ui.aceternity.com/components/hero-highlight",
        "https://ui.aceternity.com/components/hero-parallax",
        "https://ui.aceternity.com/components/hero-sections",
        "https://ui.aceternity.com/components/hover-border-gradient",
        "https://ui.aceternity.com/components/images-slider",
        "https://ui.aceternity.com/components/infinite-moving-cards",
        "https://ui.aceternity.com/components/lamp-effect",
        "https://ui.aceternity.com/components/layout-grid",
        "https://ui.aceternity.com/components/lens",
        "https://ui.aceternity.com/components/link-preview",
        "https://ui.aceternity.com/components/macbook-scroll",
        "https://ui.aceternity.com/components/meteors",
        "https://ui.aceternity.com/components/moving-border",
        "https://ui.aceternity.com/components/multi-step-loader",
        "https://ui.aceternity.com/components/navbar-menu",
        "https://ui.aceternity.com/components/parallax-scroll",
        "https://ui.aceternity.com/components/placeholders-and-vanish-input",
        "https://ui.aceternity.com/components/pointer-highlight",
        "https://ui.aceternity.com/components/resizable-navbar",
        "https://ui.aceternity.com/components/shooting-stars-and-stars-background",
        "https://ui.aceternity.com/components/sidebar",
        "https://ui.aceternity.com/components/signup-form",
        "https://ui.aceternity.com/components/sparkles",
        "https://ui.aceternity.com/components/spotlight",
        "https://ui.aceternity.com/components/spotlight-new",
        "https://ui.aceternity.com/components/sticky-banner",
        "https://ui.aceternity.com/components/sticky-scroll-reveal",
        "https://ui.aceternity.com/components/svg-mask-effect",
        "https://ui.aceternity.com/components/tabs",
        "https://ui.aceternity.com/components/tailwindcss-buttons",
        "https://ui.aceternity.com/components/text-generate-effect",
        "https://ui.aceternity.com/components/text-hover-effect",
        "https://ui.aceternity.com/components/text-reveal-card",
        "https://ui.aceternity.com/components/timeline",
        "https://ui.aceternity.com/components/tracing-beam",
        "https://ui.aceternity.com/components/typewriter-effect",
        "https://ui.aceternity.com/components/vortex",
        "https://ui.aceternity.com/components/wavy-background",
        "https://ui.aceternity.com/components/wobble-card",
        "https://ui.aceternity.com/components/world-map"
    ];

    // 生成标签的辅助函数
    function generateTags(componentName) {
        const name = componentName.toLowerCase();
        const tags = [];

        if (name.includes('3d')) tags.push('3D');
        if (name.includes('animation') || name.includes('animated')) tags.push('Animation');
        if (name.includes('card')) tags.push('Card');
        if (name.includes('background')) tags.push('Background');
        if (name.includes('hover')) tags.push('Hover');
        if (name.includes('effect')) tags.push('Effect');
        if (name.includes('grid')) tags.push('Grid');
        if (name.includes('text')) tags.push('Text');
        if (name.includes('button')) tags.push('Button');
        if (name.includes('nav') || name.includes('menu')) tags.push('Navigation');
        if (name.includes('modal')) tags.push('Modal');
        if (name.includes('tooltip')) tags.push('Tooltip');
        if (name.includes('carousel')) tags.push('Carousel');
        if (name.includes('hero')) tags.push('Hero');
        if (name.includes('form')) tags.push('Form');
        if (name.includes('spotlight')) tags.push('Spotlight');
        if (name.includes('scroll')) tags.push('Scroll');
        if (name.includes('floating')) tags.push('Floating');

        return tags.length > 0 ? tags : ['Component'];
    }

    // 生成默认 props 的辅助函数
    function generateDefaultProps(componentName) {
        return [
            {
                prop: 'className',
                type: 'string',
                default: 'undefined',
                description: `Additional CSS classes to apply to the ${componentName} container.`
            }
        ];
    }

    // 提取组件信息的函数
    function extractComponentData() {
        const data = {};

        // 提取组件名称 - 使用具体的选择器
        const titleElement = document.querySelector('h1.scroll-m-20.text-4xl.font-bold') ||
            document.querySelector('h1[class*="text-4xl"]') ||
            document.querySelector('h1');

        if (titleElement) {
            data.componentName = titleElement.textContent.trim();
        } else {
            // 从URL推导
            const pathParts = window.location.pathname.split('/');
            const componentSlug = pathParts[pathParts.length - 1];
            data.componentName = componentSlug.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        }

        // 提取标签 - 从 flex flex-wrap gap-2 容器中获取
        const tagsContainer = document.querySelector('.flex.flex-wrap.gap-2');
        const tagLinks = tagsContainer ? tagsContainer.querySelectorAll('a[href*="/categories/"]') : [];

        if (tagLinks.length > 0) {
            data.tags = Array.from(tagLinks).map(link => {
                return link.textContent.trim()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            });
        } else {
            // 备选方案：从组件名推导标签
            data.tags = generateTags(data.componentName);
        }

        // 提取描述 - 查找合适的描述文本
        let description = '';

        const targetP = document.querySelector('p.text-muted-foreground.text-lg');
        if (targetP) {
            const span = targetP.querySelector('span');
            if (span) {
                const text = span.textContent.trim();
                if (text.length > 5) {
                    description = text;
                }
            }
        }


        data.description = description;

        // 提取代码 - 查找 figure 元素中包含特定 src 的 pre 标签
        let componentCode = '';

        // 查找所有 figure 元素
        const figures = document.querySelectorAll('figure');

        for (let figure of figures) {
            // 查找 figure 中是否有包含组件代码的标识
            const srcAttribute = figure.querySelector('[src*="/registry/default/ui/"]');
            if (srcAttribute) {
                // 在这个 figure 中查找 pre 标签
                const preElement = figure.querySelector('pre');
                if (preElement) {
                    const codeText = preElement.textContent.trim();
                    if (codeText.length > componentCode.length) {
                        componentCode = codeText;
                    }
                }
            }
        }

        // 备选方案：如果没有找到 figure 中的代码，查找最大的代码块
        if (!componentCode) {
            const codeElements = document.querySelectorAll('pre code, code[class*="language-"], [class*="hljs"]');

            codeElements.forEach(el => {
                const codeText = el.textContent.trim();
                if (codeText.length > componentCode.length &&
                    !codeText.includes('npx') &&
                    !codeText.includes('npm install') &&
                    codeText.length > 50) {
                    componentCode = codeText;
                }
            });
        }

        data.code = componentCode;

        // 提取安装命令 - 查找包含npx的代码
        let installCommand = '';
        const allCodeElements = document.querySelectorAll('code, pre');

        for (let el of allCodeElements) {
            const text = el.textContent.trim();
            if (text.includes('npx shadcn')) {
                installCommand = text;
                break;
            }
        }

        if (!installCommand) {
            // 从URL生成默认安装命令
            const pathParts = window.location.pathname.split('/');
            const componentSlug = pathParts[pathParts.length - 1];
            installCommand = `npx shadcn@latest add https://ui.aceternity.com/registry/${componentSlug}.json`;
        }

        data.cliInstallCommand = installCommand;

        // 提取 Props 信息 - 查找表格
        data.props = [];
        const tables = document.querySelectorAll('table');

        tables.forEach(table => {
            const rows = table.querySelectorAll('tr');
            let isPropsTable = false;

            // 检查是否是props表格
            if (rows.length > 0) {
                const headerText = rows[0].textContent.toLowerCase();
                if (headerText.includes('prop') && (headerText.includes('type') || headerText.includes('description'))) {
                    isPropsTable = true;
                }
            }

            if (isPropsTable) {
                rows.forEach((row, index) => {
                    if (index === 0) return; // 跳过表头
                    const cells = row.querySelectorAll('td, th');
                    if (cells.length >= 2) {
                        const propData = {
                            prop: cells[0]?.textContent.trim() || '',
                            type: cells[1]?.textContent.trim() || '',
                            default: cells[2]?.textContent.trim() || '',
                            description: cells[cells.length - 1]?.textContent.trim() || ''
                        };

                        // 只添加有效的prop数据
                        if (propData.prop && propData.prop !== 'Prop' && propData.prop !== '---|---|---|') {
                            data.props.push(propData);
                        }
                    }
                });
            }
        });

        // 如果没有找到props，生成默认的
        if (data.props.length === 0) {
            data.props = generateDefaultProps(data.componentName);
        }

        return data;
    }

    // 创建控制面板
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #1f2937;
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: monospace;
            min-width: 300px;
        `;

        panel.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #60a5fa;">组件数据爬取器</h3>
            <button id="extractCurrent" style="
                background: #3b82f6;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                margin: 5px;
                width: 100%;
            ">提取当前页面数据</button>

            <button id="extractAll" style="
                background: #10b981;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                margin: 5px;
                width: 100%;
            ">批量爬取所有组件</button>

            <button id="downloadData" style="
                background: #f59e0b;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                margin: 5px;
                width: 100%;
                display: none;
            ">下载数据</button>

            <div id="progress" style="margin-top: 10px; font-size: 12px;"></div>
            <div id="status" style="margin-top: 10px; font-size: 12px; color: #9ca3af;"></div>
        `;

        document.body.appendChild(panel);
        return panel;
    }

    // 从 HTML 字符串提取数据的辅助函数
    function extractDataFromHTML(htmlString, url) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        const data = {};

        // 从 URL 获取组件名
        const urlParts = url.split('/');
        const componentSlug = urlParts[urlParts.length - 1];

        // 提取组件名称 - 使用具体的选择器
        const titleElement = doc.querySelector('h1.scroll-m-20.text-4xl.font-bold') ||
            doc.querySelector('h1[class*="text-4xl"]') ||
            doc.querySelector('h1');

        if (titleElement) {
            data.componentName = titleElement.textContent.trim();
        } else {
            data.componentName = componentSlug.split('-').map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        }

        // 提取标签 - 从 flex flex-wrap gap-2 容器中获取
        const tagsContainer = doc.querySelector('.flex.flex-wrap.gap-2');
        const tagLinks = tagsContainer ? tagsContainer.querySelectorAll('a[href*="/categories/"]') : [];

        if (tagLinks.length > 0) {
            data.tags = Array.from(tagLinks).map(link => {
                return link.textContent.trim()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            });
        } else {
            // 备选方案：从组件名推导标签
            data.tags = generateTags(data.componentName);
        }

        // 提取描述
        const span = document.querySelector('p.text-muted-foreground.text-lg span[data-br]');
        const description = span ? span.textContent.trim() : '';
        data.description = description

        // 提取代码 - 查找 figure 元素中包含特定 src 的 pre 标签
        let componentCode = '';

        // 查找所有 figure 元素
        const figures = doc.querySelectorAll('figure');

        for (let figure of figures) {
            // 查找 figure 中是否有包含组件代码的标识
            const srcAttribute = figure.querySelector('[src*="/registry/default/ui/"]');
            if (srcAttribute) {
                // 在这个 figure 中查找 pre 标签
                const preElement = figure.querySelector('pre');
                if (preElement) {
                    const codeText = preElement.textContent.trim();
                    if (codeText.length > componentCode.length) {
                        componentCode = codeText;
                    }
                }
            }
        }

        // 备选方案：查找最大的代码块
        if (!componentCode) {
            const codeElements = doc.querySelectorAll('pre code, code[class*="language-"]');

            codeElements.forEach(el => {
                const codeText = el.textContent.trim();
                if (codeText.length > componentCode.length &&
                    !codeText.includes('npx') &&
                    !codeText.includes('npm install') &&
                    codeText.length > 50) {
                    componentCode = codeText;
                }
            });
        }

        data.code = componentCode;

        // 提取安装命令
        let installCommand = '';
        const allCodeElements = doc.querySelectorAll('code, pre');

        for (let el of allCodeElements) {
            const text = el.textContent.trim();
            if (text.includes('npx shadcn')) {
                installCommand = text;
                break;
            }
        }

        if (!installCommand) {
            installCommand = `npx shadcn@latest add https://ui.aceternity.com/registry/${componentSlug}.json`;
        }

        data.cliInstallCommand = installCommand;

        // 提取 Props 信息
        data.props = [];
        const tables = doc.querySelectorAll('table');

        tables.forEach(table => {
            const rows = table.querySelectorAll('tr');
            let isPropsTable = false;

            if (rows.length > 0) {
                const headerText = rows[0].textContent.toLowerCase();
                if (headerText.includes('prop') && (headerText.includes('type') || headerText.includes('description'))) {
                    isPropsTable = true;
                }
            }

            if (isPropsTable) {
                rows.forEach((row, index) => {
                    if (index === 0) return; // 跳过表头
                    const cells = row.querySelectorAll('td, th');
                    if (cells.length >= 2) {
                        const propData = {
                            prop: cells[0]?.textContent.trim() || '',
                            type: cells[1]?.textContent.trim() || '',
                            default: cells[2]?.textContent.trim() || '',
                            description: cells[cells.length - 1]?.textContent.trim() || ''
                        };

                        if (propData.prop && propData.prop !== 'Prop' && propData.prop !== '---|---|---|') {
                            data.props.push(propData);
                        }
                    }
                });
            }
        });

        // 如果没有找到props，生成默认的
        if (data.props.length === 0) {
            data.props = generateDefaultProps(data.componentName);
        }

        return data;
    }

    // 主程序
    window.addEventListener('load', () => {
        const panel = createControlPanel();
        let allData = [];

        // 提取当前页面数据
        document.getElementById('extractCurrent').addEventListener('click', () => {
            try {
                const data = extractComponentData();
                console.log('当前页面数据:', data);

                // 复制到剪贴板
                const jsonString = JSON.stringify(data, null, 2);
                if (typeof GM_setClipboard !== 'undefined') {
                    GM_setClipboard(jsonString);
                } else {
                    navigator.clipboard.writeText(jsonString).catch(err => {
                        console.error('复制失败:', err);
                        // 创建临时文本区域作为备用方案
                        const textArea = document.createElement('textarea');
                        textArea.value = jsonString;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                    });
                }

                document.getElementById('status').textContent = '数据已复制到剪贴板!';

                // 在控制台显示格式化的数据
                console.log('提取的JSON数据:');
                console.log(jsonString);

            } catch (error) {
                console.error('提取数据时出错:', error);
                document.getElementById('status').textContent = '提取失败: ' + error.message;
            }
        });

        // 批量爬取所有组件
        document.getElementById('extractAll').addEventListener('click', async () => {
            allData = [];
            const progressDiv = document.getElementById('progress');
            const statusDiv = document.getElementById('status');

            statusDiv.textContent = '开始批量爬取...';

            for (let i = 0; i < componentUrls.length; i++) {
                const url = componentUrls[i];
                progressDiv.textContent = `进度: ${i + 1}/${componentUrls.length} - ${url.split('/').pop()}`;

                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }

                    const html = await response.text();
                    const componentData = extractDataFromHTML(html, url);
                    allData.push(componentData);

                    console.log(`已爬取: ${componentData.componentName}`);

                    // 添加延迟避免请求过快
                    await new Promise(resolve => setTimeout(resolve, 1000));

                } catch (error) {
                    console.error(`爬取 ${url} 失败:`, error);
                    statusDiv.textContent = `爬取 ${url} 失败: ${error.message}`;

                    // 继续处理下一个，不要中断整个流程
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            statusDiv.textContent = `爬取完成! 共获取 ${allData.length} 个组件数据`;
            document.getElementById('downloadData').style.display = 'block';

            console.log('所有爬取的数据:', allData);
        });

        // 下载数据
        });

})();
