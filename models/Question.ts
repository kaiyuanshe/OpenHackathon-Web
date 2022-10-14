export interface Question {
  title: string;
  options?: string[];
  multiple?: boolean;
  type?: 'text' | 'url';
  required?: boolean;
}

export interface Extensions {
  name: string;
  value: string;
}
export const questions: Question[] = [
  {
    title: '您的专业',
    options: [
      '前端工程师',
      '后端工程师',
      '客户端工程师',
      '游戏工程师',
      '算法工程师',
      '区块链工程师',
      '运维工程师',
      '测试工程师',
      '架构师',
      '项目/产品经理',
      '在校生',
      '其它',
    ],
    multiple: true,
  },
  {
    title: '常用的编程语言',
    options: [
      'JavaScript/TypeScript',
      'Java/Scala/Groovy/Kotlin',
      'C#',
      'Python',
      'PHP',
      'Ruby',
      'Dart',
      'Objective-C/Swift',
      'Rust',
      'Go',
      'C/C++',
      '其它',
    ],
    multiple: true,
  },
  {
    title: '领英/个人简历/个人博客',
    type: 'url',
  },
  {
    title: '社交媒体账号/推特/微博',
    type: 'url',
  },
  {
    title: '本次比赛您感兴趣的赛题是什么？',
    type: 'text',
  },
  {
    title: '您希望从系列工作坊/讲座中听到哪方面内容',
    type: 'text',
  },
  {
    title: '您是否愿意进行组队？',
    options: ['是', '否，喜欢个人', '否，已有团队'],
  },
  {
    title: '您介意新手加入您的团队？',
    options: ['是', '否'],
  },
  {
    title:
      '关于队友，您还有什么其他需求吗? 我们会尽全力帮助您找到合适人选，助力您的黑客松之旅。',
    type: 'text',
  },
];
