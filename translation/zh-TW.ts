import { textJoin } from 'mobx-i18n';

export default {
  home_page: '主頁',
  load_more: '加載更多……',
  no_more: '沒有更多',
  select: '選擇',
  open_hackathon_platform: '開放黑客松',
  create_activity: '創建活動',
  edit_activity: '編輯活動',
  powerful_by: '由',
  powerful_driver: 'idea2app 腳手架強力驅動',
  registration_period: '報名時段',
  activity_period: '活動時段',
  register_after: ({ distance, unit }: Record<'distance' | 'unit', string>) =>
    textJoin(distance, unit, '後開始報名'),
  enrolling: '正在報名',
  competition_over: '比賽結束',
  my_team: '我的團隊',
  in_progress: '比賽進行中',
  judges_review: '評委審核中',
  submit_work_deadline: '作品提交截止',
  pending_review: '未上線，待審核',
  create_hackathons: '創建黑客松活動',
  all_activity: '所有比賽',
  language: '語言',
  get_started: '新手幫助',
  open_source_code: '開源代碼',
  people_registered: '人已報名',
  time_range: '時間範圍',
  name: '名稱',
  last_login_time: '最後登陸時間',
  login_way: '登錄方式',
  phone_number: '聯繫電話',
  contact_address: '聯繫地址',
  description: '描述',
  please_enter_description: '請輸入描述',
  please_enter_logo_url: '請輸入 Logo URI',
  please_enter_url: '請輸入 URL',
  logo_url: 'Logo 地址',
  url: 'URL',
  operation: '操作',
  user_name: '用戶名',
  nick_name: '暱稱',
  mail: '郵箱',
  role_source: '帳戶來源',
  introduction: '介紹',
  apply_role: '申請角色',
  apply_time: '申請時間',
  remark: '備注',
  remark_placeholder: '可輸入備注信息，以便團隊管理員更快通過審核。',
  quantity: '數量',
  type: '類型',
  photo: '照片',
  clear_form: '清空表單',
  prize_settings: '獎項設置',
  update: '更新',
  award: '獎項',
  a_total_of: '共',
  people: '人',
  personal: '個人',
  user: '用戶',
  team: '团队',
  join_activity_team: '參賽團隊',
  loading: '加載中……',
  sign_in: '登錄',
  sign_out: '退出',
  create: '創建',
  edit: '編輯',
  submit: '提交',
  save: '保存',
  success: '成功',
  cancel: '取消',
  edit_profile: '編輯用戶資料',
  hackathons: '黑客鬆活動',
  more_events: '更多活動',
  registration_deadline: '距報名截止還有',
  registered: '已報名',
  register: '報名',
  sponsors: '贊助夥伴',
  partners: '合作主辦',
  top_hackathons: '熱門活動',
  manage_this_hackathon: '管理',
  delete: '刪除',
  all: '全部',
  organizer: '主辦方',
  organizer_manage: '主辦方管理',
  activity_address: '活動地址',
  activity_status: '活動狀態',
  registration_status: '報名狀態',
  registration_count: '報名人數',
  register_now: '立即報名',
  cloud_development: '雲開發',
  create_team: '創建團隊',
  create_team_success: '團隊創建成功！',
  team_introduction: '團隊簡介',
  auto_approve: '自動同意',
  registration_needs_review: '報名須管理員審核，請耐心等候……',
  hackathon_detail: '活動詳情',
  no_news_yet: '暫無消息',
  no_team: '暫未加入任何團隊',
  no_address_navigation: '暫無地址導航',
  latest_news: '最新動態',
  all_teams: '所有團隊',
  team_leader: '隊長：',
  team_members: '團隊成員',
  join_team: '加入團隊',
  leave_team: '退出團隊',
  manage_team: '管理團隊',
  cancel_application: '取消申請',
  team_manage: '團隊管理',
  team_works: '團隊作品',
  please_make_sure: '請確認是否',
  followed_hackathons: '關注的活動',
  owned_hackathons: '創建的活動',
  joined_hackathons: '參與的活動',
  questionnaire: '參賽者問卷',
  view_statistics: '查看統計',
  registration_statistics: '報名統計',
  total_people: '總人數：',
  export_excel: '導出 Excel',
  sign_up_user: '報名用戶',
  please_complete_all_mandatory_fields_before_you_proceed: '建議您先完善或更新',
  personal_profile: '個人資料',
  enter_for: '報名參加',
  linkein_or_cv: '領英/個人簡歷/個人部落格',
  social_media_account_or_twitter_or_weibo: '社交媒體帳號/推特/微博',
  which_of_these_particular_areas_are_you_interested_in_going_into_this_event:
    '本次比賽您感興趣的賽題是什麼？',
  what_do_you_hope_to_learn_from_the_workshops:
    '您希望從系列工作坊/講座中學習到那方面的內容',
  do_you_plan__on_hacking_solo_or_with_a_team: '您是否願意組隊？',
  yes: '是',
  no_i_prefer_solo: '否，喜歡個人',
  no_i_have_a_team: '否，已經組隊',
  would_you_be_open_to_having_a_beginner_join_your_team:
    '您是否建議新手加入您的團隊',
  no: '否',
  anything_else_we_should_know_about_what_youre_looking_for_in_a_team_or_teammate:
    '關於隊友您還有其他什麼要求麼？我們會盡力幫您找到合適成員，助力您的黑客鬆之旅。',
  what_is_your_occupation: '您的專業',
  front_end_engineer: '前端工程師',
  back_end_engineer: '後端工程師',
  client_engineer: '客戶端工程師',
  game_developerment_engineer: '遊戲工程師',
  algorithm_engineer: '算法工程師',
  blockchain_engineer: '區塊鏈工程師',
  operations: '運維工程師',
  quality_assurance_engineer: '測試工程師',
  architect: '架構師',
  project_manager: '項目/產品經理',
  student: '在校生',
  others: '其它',
  what_are_your_commonly_used_programming_languages: '常用編程語言',
  approve: '通過',
  status_none: '未審核',
  status_approved: '通過',
  status_pending: '審核中',
  status_rejected: '拒絕',
  all_user: '全部用戶',
  referee: '裁判',
  admin: '管理員',
  member: '隊員',
  please_select_at_least_one_user: '請至少選擇一位用戶',
  confirm_to_delete_admin_or_referee: '確認刪除所選管理員/裁判',
  please_select_at_least_one_partner: '請至少選擇一位主辦方/合作夥伴！',
  confirm_to_delete_partner: '確認刪除所選主辦方/合作夥伴？',
  add: '增加',
  search: '搜索',
  export: '導出',
  all_works: '所有作品',
  repository_name: '倉庫名',
  authorize_all_teammates: '授權全部隊友',
  instant_cloud_development: '即刻雲開發',
  cloud_development_environment: '雲開發環境',
  creat_clound_environment: '創建開發環境',
  team_registration: '團隊報名',
  role_management: '角色管理',
  submit_work: '提交作品',
  upload_work: '上傳作品',
  upload_file: '上傳文件',
  work_type: '作品類型',
  edit_work: '編輯作品',
  work_url: '作品在線鏈接',
  confirm_delete_work: '確認刪除作品？',
  platform_management: '平台管理',
  host: '主辦',
  undertake: '承辦',
  coorganizer: '協辦',
  sponsor: '贊助',
  titlesponsor: '冠名',
  basic_settings: '基礎設置',
  works_awards: '作品評獎',
  add_sponsor_information: '增加主辦方信息',
  sponsor_information: '主辦方信息',
  competition_location: '比賽地點',
  announcement: '公告',
  advance_settings: '高級設置',
  cloud_resource: '雲資源',
  virtual_environment: '虛擬環境',
  environmental_monitoring: '環境監控',
  log: '日誌',
  website: '網站',
  image: '圖片',
  video: '視頻',
  view_work: '查看作品',
  update_time: '更新時間',
  create_time: '創建時間',
  hacker_pavilion: '黑客館',
  mystery_hacker: '神秘黑客',
  status: '狀態',
  role_type: '角色類型',
  send: '發送',
  search_an_user: '請先搜索並選擇一位用戶',
  add_manager: '增加管理員',
  create_work_success: '活動創建成功，是否申請發布活動',
  has_published: '已申請發布活動，請等待審核',
  edited_success: '修改成功',
  quote_required: '（必填）',
  name_placeholder: '名稱，僅限字母和數字',
  please_enter_name: '請輸入名稱',
  disaplay_name: '顯示名稱',
  tag: '標籤',
  tag_placeholder: '標籤，請以空格分隔',
  bannerUrls: '頭圖（必填，最多10張）',
  enrollment: '報名時間',
  activity_time: '活動時間',
  judge_time: '評分時間',
  ribbon: '廣告語',
  max_enrollment: '報名人數限制',
  max_enrollment_placeholder: '0 表示無限',
  activity_introduction: '活動簡介',
  sure_delete_this_work: '確定刪除該獎項？',
  apply_publish: '申請上線',
  publish: '上線',
  offline: '下線',
  sure_publish: ({ name }: { name: string }) =>
    textJoin('確定讓', name, '上線？'),
  sure_offline: ({ name }: { name: string }) =>
    textJoin('確定讓', name, '下線？'),
  activity_manage: '活動管理',
  no_permission: '暫無權限',
  sign_up_trends: '報名趨勢',
  basic_info: '基本信息',
  city_distribution: '城市分布',
  approval_status: '審核狀態',
  custom_questionnaire: '自定義問卷',
  access_preview: '訪問預覽',
  title: '標題',
  content: '內容',
  sure_delete_this_message: '確定刪除該公告？',
  admin_management: '管理管理員',
  confirm_to_delete_platform_admin: '確定刪除所选平台管理員？',
  profile: '個人資料',
  add_template_repository: '添加倉庫模板',
  stay_tuned: '敬請期待',
  confirm_to_delete_announcement: '確認刪除所選公告？',
  please_select_at_least_one_announcement: '請至少選擇一條公告!',
  announcement_manage: '公告管理',
  publish_announcement: '發佈新公告',
  sign_up_successfully: '報名成功',
  rejected: '已拒絕',
  already_registered_waiting_for_approval: '已報名，等待通過',
  not_sign_up: '未報名',
  please_use_github_login: '請用 GitHub 賬號登錄后使用',
} as const;
