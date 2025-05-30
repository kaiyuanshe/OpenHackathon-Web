import { textJoin } from 'mobx-i18n';
import { IDType } from 'mobx-restful';
import { diffTime } from 'web-utility';

export default {
  home_page: '主页',
  load_more: '加载更多……',
  no_more: '没有更多',

  // Pagination Table
  create: '新增',
  view: '查看',
  submit: '提交',
  cancel: '取消',
  edit: '编辑',
  delete: '删除',
  total_x_rows: ({ totalCount }: { totalCount: number }) => `共 ${totalCount} 行`,
  sure_to_delete_x: ({ keys }: { keys: IDType[] }) => `您确定删除 ${keys.join('、')} 吗？`,

  select: '选择',
  open_hackathon_platform: '开放黑客松',
  create_activity: '创建活动',
  edit_activity: '编辑活动',
  powered_by: '由',
  idea2app_scaffolding: 'idea2app 脚手架强力驱动',
  registration_period: '报名时段',
  activity_period: '活动时段',
  register_after: ({ distance, unit }: ReturnType<typeof diffTime>) =>
    textJoin(distance + '', unit, '后开始报名'),
  accepting_applications: '正在报名',
  activity_ended: '比赛结束',
  my_team: '我的团队',
  in_progress: '比赛进行中',
  judges_review: '评委审核中',
  submit_work_deadline: '作品提交截止',
  pending_review: '未上线，待审核',
  create_hackathons: '创建黑客松活动',
  all_activity: '所有比赛',
  language: '语言',
  get_started: '新手帮助',
  open_source_code: '开源代码',
  people_registered: '人已报名',
  time_range: '时间范围',
  name: '名称',
  last_login_time: '最后登录时间',
  login_way: '登录方式',
  phone_number: '联系电话',
  contact_address: '联系地址',
  description: '描述',
  please_enter: '请输入',
  please_enter_description: '请输入描述',
  please_enter_logo_url: '请输入 Logo URI',
  please_enter_url: '请输入 URL',
  logo_URL: 'Logo 地址',
  url: 'URL',
  operation: '操作',
  user_name: '用户名',
  nick_name: '昵称',
  mail: '邮箱',
  role_source: '帐户来源',
  introduction: '介绍',
  apply_role: '申请角色',
  apply_time: '申请时间',
  remark: '备注',
  remark_placeholder: '可输入备注信息，以便团队管理员更快通过审核。',
  quantity: '数量',
  type: '类型',
  photo: '照片',
  clear_form: '清空表单',
  prize_settings: '奖项设置',
  update: '更新',
  award: '奖项',
  a_total_of: '共',
  people: '人',
  personal: '个人',
  user: '用户',
  team: '团队',
  join_activity_team: '参赛团队',
  loading: '加载中……',
  sign_in: '登录',
  sign_out: '登出',
  save: '保存',
  success: '成功',
  edit_profile: '编辑用户资料',
  edit_profile_tips: '在 GitHub 编辑用户资料后，下次登录时会自动同步。',
  hackathons: '黑客松活动',
  more_events: '更多活动',
  registration_deadline: '距报名截止还有',
  registered: '已报名',
  register: '报名',
  sponsors: '赞助伙伴',
  partners: '合作伙伴',
  top_hackathons: '热门活动',
  manage_this_hackathon: '管理',
  all: '全部',
  organizer: '主办方',
  organizer_manage: '主办方管理',
  activity_address: '活动地址',
  activity_status: '活动状态',
  registration_status: '报名状态',
  registration_count: '报名人数',
  register_now: '立即报名',
  cloud_development: '云开发',
  create_team: '创建团队',
  create_team_success: '团队创建成功！',
  team_introduction: '团队简介',
  auto_approve: '自动同意',
  registration_needs_review: '报名须管理员审核，请耐心等候……',
  hackathon_detail: '活动详情',
  no_news_yet: '暂无消息',
  no_team: '暂未加入任何团队',
  no_address_navigation: '暂无地址导航',
  latest_news: '最新动态',
  all_teams: '所有团队',
  team_leader: '队长：',
  team_members: '团队成员',
  join_team: '加入团队',
  leave_team: '退出团队',
  manage_team: '管理团队',
  cancel_application: '取消申请',
  team_manage: '团队管理',
  team_works: '团队作品',
  please_make_sure: '请确定是否',
  followed_hackathons: '关注的活动',
  owned_hackathons: '创建的活动',
  joined_hackathons: '参与的活动',
  questionnaire: '参赛者问卷',
  view_statistics: '查看统计',
  registration_statistics: '报名统计',
  total_people: '总人数：',
  export_excel: '导出 Excel',
  sign_up_user: '报名用户',
  please_complete_all_mandatory_fields_before_you_proceed: '建议您先完善或更新',
  personal_profile: '个人资料',
  enter_for: '报名参加',
  linkein_or_cv: '领英/个人简历/个人博客',
  social_media_account_or_twitter_or_weibo: '社交媒体账号/推特/微博',
  which_of_these_particular_areas_are_you_interested_in_going_into_this_event:
    '本次比赛您感兴趣的赛题是什么？',
  what_do_you_hope_to_learn_from_the_workshops: '您希望从系列工作坊/讲座中听到哪方面内容',
  do_you_plan__on_hacking_solo_or_with_a_team: '您是否愿意进行组队？',
  yes: '是',
  no_i_prefer_solo: '否，喜欢个人',
  no_i_have_a_team: '否，已有队伍',
  would_you_be_open_to_having_a_beginner_join_your_team: '您介意新手加入您的团队？',
  no: '否',
  anything_else_we_should_know_about_what_youre_looking_for_in_a_team_or_teammate:
    '关于队友，您还有什么其他需求吗? 我们会尽全力帮助您找到合适人选，助力您的黑客松之旅。',
  what_is_your_occupation: '您的专业',
  front_end_engineer: '前端工程师',
  back_end_engineer: '后端工程师',
  client_engineer: '客户端工程师',
  game_developerment_engineer: '游戏工程师',
  algorithm_engineer: '算法工程师',
  blockchain_engineer: '区块链工程师',
  operations: '运维工程师',
  quality_assurance_engineer: '测试工程师',
  architect: '架构师',
  project_manager: '项目/产品经理',
  student: '在校生',
  others: '其它',
  what_are_your_commonly_used_programming_languages: '常用的编程语言',
  approve: '通过',
  status_none: '未审核',
  status_approved: '通过',
  status_pending: '审核中',
  status_rejected: '拒绝',
  all_user: '全部用户',
  referee: '裁判',
  admin: '管理员',
  member: '队员',
  please_select_at_least_one_user: '请至少选择一位用户',
  confirm_to_delete_admin_or_referee: '确认删除所选管理员/裁判？',
  please_select_at_least_one_partner: '请至少选择一位主办方/合作伙伴!',
  confirm_to_delete_partner: '确认删除所选主办方/合作伙伴？',
  add: '增加',
  search: '搜索',
  export: '导出',
  all_works: '所有作品',
  repository_name: '仓库名',
  authorize_all_teammates: '授权全部队友',
  instant_cloud_development: '即刻云开发',
  cloud_development_environment: '云开发环境',
  create_cloud_environment: '创建开发环境',
  team_registration: '团队报名',
  role_management: '角色管理',
  submit_work: '提交作品',
  upload_work: '上传作品',
  upload_file: '上传文件',
  work_type: '作品类型',
  edit_work: '编辑作品',
  work_url: '作品在线链接',
  confirm_delete_work: '确认删除作品？',
  platform_management: '平台管理',
  host: '主办',
  undertake: '承办',
  coorganizer: '协办',
  sponsor: '赞助',
  titlesponsor: '冠名',
  basic_settings: '基础设置',
  works_awards: '作品评奖',
  add_sponsor_information: '增加主办方信息',
  sponsor_information: '主办方信息',
  competition_location: '比赛地点',
  announcement: '公告',
  advance_settings: '高级设置',
  cloud_resource: '云资源',
  virtual_environment: '虚拟环境',
  environmental_monitoring: '环境监控',
  log: '日志',
  website: '网站',
  image: '图片',
  video: '视频',
  view_work: '查看作品',
  update_time: '更新时间',
  create_time: '创建时间',
  hacker_pavilion: '黑客馆',
  mystery_hacker: '神秘黑客',
  status: '状态',
  role_type: '角色类型',
  send: '发送',
  search_an_user: '请先搜索并选择一位用户',
  add_manager: '增加管理员',
  create_work_success: '活动创建成功，是否申请发布活动',
  has_published: '已申请发布活动,请等待审核',
  edited_success: '修改成功',
  name_placeholder: 'ID，仅限字母和数字',
  please_enter_name: '请输入名称',
  activity_id: '活动 ID',
  activity_name: '活动名称',
  display_name: '显示名称',
  tag: '标签',
  tag_placeholder: '按回车键以添加一个标签',
  bannerUrls: '头图（最多10张）',
  enrollment: '报名时间',
  activity_time: '活动时间',
  judge_time: '评分时间',
  ribbon: '广告语',
  max_enrollment: '报名人数限制',
  max_enrollment_placeholder: '0 表示无限',
  activity_introduction: '活动简介',
  activity_detail: '活动详情',
  sure_delete_this_work: '确定删除该奖项？',
  apply_publish: '申请上线',
  publish: '上线',
  offline: '下线',
  sure_publish: ({ name }: { name: string }) => textJoin('确认让', name, '上线？'),
  sure_offline: ({ name }: { name: string }) => textJoin('确认让', name, '下线？'),
  activity_manage: '活动管理',
  no_permission: '暂无权限',
  sign_up_trends: '报名趋势',
  basic_info: '基本信息',
  city_distribution: '城市分布',
  approval_status: '审核状态',
  custom_questionnaire: '自定义问卷',
  access_preview: '访问预览',
  title: '标题',
  content: '内容',
  sure_delete_this_message: '确定删除该公告？',
  admin_management: '管理员管理',
  confirm_to_delete_platform_admin: '确认删除所选平台管理员',
  profile: '个人资料',
  add_template_repository: '添加模板仓库',
  stay_tuned: '敬请期待',
  confirm_to_delete_announcement: '确认删除所选公告？',
  please_select_at_least_one_announcement: '请至少选择一条公告!',
  announcement_manage: '公告管理',
  publish_announcement: '发布新公告',
  sign_up_successfully: '报名成功',
  rejected: '已拒绝',
  already_registered_waiting_for_approval: '已报名，等待通过',
  not_sign_up: '未报名',
  please_use_github_login: '请用 GitHub 账号登录后使用',
  score: '成绩',
  work_list: '作品列表',
  prize_list: '奖项列表',
  prize_distribution: '奖项分配',
  all_prize: '全部奖项',
  grant: '授予',
  confirm: '确认',
  team_name: '团队名称',
  huaweicloud: '华为云',
  microsoft: '微软',
  authing: 'Authing',
  gitcafe: 'Gitcafe',
  ubuntukylin: '优麒麟',
  alauda: '灵雀云',
  jikexueyuan: '极客学院',
  jstorm: 'JStorm',
  wicresoft: '微创科技',
  juhe: '聚合数据',
  hackathon_message: '黑客松平台消息',
  Second: '秒',
  Minute: '分',
  Hour: '时',
  Day: '天',
  Week: '周',
  Month: '月',
  Year: '年',
  unlimited: '无限制',
  start_time_earlier_end_time: '开始时间必须早于结束时间',
  address: '地址',
  confirm_delete_repo: '确认删除仓库模板',
  choose_at_least_one_repo: '请至少选择一个仓库模板',
  survey: '问卷',
  edit_questionnaire: '编辑问卷',
  text: '文本',
  link: '链接',
  question_id: '问题ID',
  question_id_repeat: '问题ID重复',
  question_description: '问题描述',
  question_type: '问题类型',
  option_config: '选项配置',
  whether_multiple: '是否多选',
  whether_required: '是否必填',
  multiple: '多选',
  not_multiple: '单选',
  move_up: '上移',
  move_down: '下移',
  add_question: '添加问题',
  please_add_question: '请添加问题',
  create_questionnaire: '创建问卷',
  update_questionnaire: '更新问卷',
  create_questionnaire_success: '创建问卷成功！',
  update_questionnaire_success: '更新问卷成功！',
  delete_questionnaire: '删除问卷',
  delete_questionnaire_success: '删除问卷成功！',
  preview_questionnaire: '问卷预览',
  confirm_to_delete_questionnaire: '确认删除该问卷？',
  for_example: (example: string) => '例如：' + example,
} as const;
