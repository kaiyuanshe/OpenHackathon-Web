import { Question } from '../../model';

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
            '其它'
        ],
        multiple: true
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
            '其它'
        ],
        multiple: true
    }
];
