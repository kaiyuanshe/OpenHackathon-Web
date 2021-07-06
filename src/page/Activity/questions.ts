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
    },
   {
        title: '领英/个人介绍',
    },
{
        title: '社交媒体账号/Twitter/Weibo',
    },
{
        title: '本次比赛您感兴趣的赛题是什么？',
    },
{
        title: '您希望从系列工作坊/讲座中听到哪方面内容？',
    },

{
        title: '您是否愿意进行组队？',
   options: [
            '是',
            '否，喜欢个人SOLO',
            '否，已有队伍',
        ],
    },
   {
        title: '您介意新手加入您的团队？',
      options: [
            '是',
            '否',
        ],
    },
{
        title: '关于队友，您还有什么其他需求吗？我们会尽全力帮助您找到合适人选，助力您的DEVE2030比赛之旅。',
    },

];
