import { textJoin } from 'mobx-i18n';

export default {
  home_page: 'Home page',
  load_more: 'Load more...',
  no_more: 'No more',
  select: 'select',
  open_hackathon_platform: 'Open Hackathon',
  create_activity: 'Create Activity',
  edit_activity: 'Edit Activity',
  powerful_by: 'Power by',
  powerful_driver: 'idea2app Scaffolding power drive',
  registration_period: 'Registration Period',
  activity_period: 'Ativity Period',
  register_after: ({ distance, unit }: Record<'distance' | 'unit', string>) =>
    textJoin('Registration after', distance, unit),
  enrolling: 'Enrolling',
  competition_over: 'Activity finished',
  my_team: 'My Team',
  in_progress: 'In progress',
  judges_review: 'Judges reviewing',
  submit_work_deadline: 'Submission Deadline',
  pending_review: 'Not online, pending_review',
  create_hackathons: 'Create Hackathons',
  all_activity: 'All Activity',
  language: 'Language',
  get_started: 'Get Started',
  open_source_code: 'Source Code',
  people_registered: 'registered',
  time_range: 'Time range',
  name: 'Name',
  last_login_time: 'Last login time',
  login_way: 'Login Way',
  phone_number: 'Contact number',
  contact_address: 'Contact address',
  description: 'description',
  please_enter_description: 'Please enter a description',
  please_enter_logo_url: 'Please enter a Logo URI',
  please_enter_url: 'Please enter a URL',
  logo_url: 'Logo address',
  url: 'URL',
  operation: 'Operation',
  user_name: 'Username',
  nick_name: 'Nickname',
  mail: 'Mail',
  role_source: 'Account source',
  introduction: 'Introduction',
  apply_role: 'Apply for a role',
  apply_time: 'Application time',
  remark: 'Remark',
  remark_placeholder:
    'Remarks can be entered for faster approval by team admins.',
  quantity: 'Quantity',
  type: 'Type',
  photo: 'Photo',
  clear_form: 'Clear Form',
  prize_settings: 'Prize Settings',
  update: 'Update',
  award: 'Award',
  a_total_of: 'A total of',
  people: 'people',
  personal: 'Personal',
  user: 'User',
  team: 'Team',
  join_activity_team: 'Joined Team',
  loading: 'Loading...',
  sign_in: 'Sign in',
  sign_out: 'Sign out',
  create: 'Create',
  edit: 'Edit',
  submit: 'Submit',
  save: 'Save',
  success: 'success',
  cancel: 'Cancel',
  edit_profile: 'Edit Profile',
  hackathons: 'Hackathons',
  more_events: 'More events',
  registration_deadline: 'Registration closing in',
  registered: 'registered',
  register: 'Register',
  sponsors: 'Sponsors',
  partners: 'Partners',
  top_hackathons: 'Top hackathons',
  manage_this_hackathon: 'Manage',
  delete: 'Delete',
  all: 'All',
  organizer: 'Organizer',
  organizer_manage: 'Manage Organizer',
  activity_address: 'Activity Address',
  activity_status: 'Activity Status',
  registration_status: 'Registration Status',
  registration_count: 'Registration Count',
  register_now: 'Register Now',
  cloud_development: 'Cloud development',
  create_team: 'Create Team',
  create_team_success: 'The team was created successfully!',
  team_introduction: 'Team Profile',
  auto_approve: 'Automatic Consent',
  registration_needs_review:
    'registration must be reviewed by the administrator, please wait patiently...',
  hackathon_detail: 'Hackathon detail',
  no_news_yet: 'No news yet',
  no_team: "Haven't joined any team yet",
  no_address_navigation: 'No address navigation',
  latest_news: 'Latest news',
  all_teams: 'All teams',
  team_leader: 'Team leader',
  team_members: 'Team members',
  join_team: 'Join team',
  leave_team: 'Leave team',
  manage_team: 'Manage Team',
  cancel_application: 'Cancel Application',
  team_manage: 'Team Manage',
  team_works: 'Team work',
  please_make_sure: 'Please make sure',
  followed_hackathons: 'Followed hackathons',
  owned_hackathons: 'Owned hackathons',
  joined_hackathons: 'Joined hackathons',
  questionnaire: 'Questionnaire',
  view_statistics: 'View Statistics',
  registration_statistics: 'Registration Statistics',
  total_people: 'Total people:',
  export_excel: 'Export to Excel',
  sign_up_user: 'Sign up user',
  please_complete_all_mandatory_fields_before_you_proceed:
    'Please complete all mandatory fields before you proceed',
  personal_profile: 'Personal Profile',
  enter_for: 'Sign Up',
  linkein_or_cv: 'LinkeIn/CV/Blog',
  social_media_account_or_twitter_or_weibo:
    'Social Media Account/Twitter/Weibo',
  which_of_these_particular_areas_are_you_interested_in_going_into_this_event:
    'Which of these particular areas are you interested in going into this event?',
  what_do_you_hope_to_learn_from_the_workshops:
    'What do you hope to learn from the workshops',
  do_you_plan__on_hacking_solo_or_with_a_team:
    'Do you plan on hacking solo or with a team?',
  yes: 'Yes',
  no_i_prefer_solo: 'No,I prefer SOLO',
  no_i_have_a_team: 'NO,I have a team',
  would_you_be_open_to_having_a_beginner_join_your_team:
    'Would you be open to having a beginner join your team?',
  no: 'No',
  anything_else_we_should_know_about_what_youre_looking_for_in_a_team_or_teammate:
    'Anything else we should know about what youre looking for in a team or teammate?',
  what_is_your_occupation: 'What is your occupation',
  front_end_engineer: 'Front-End engineer',
  back_end_engineer: 'Back-End engineer',
  client_engineer: 'Client engineer',
  game_developerment_engineer: 'Game developerment engineer',
  algorithm_engineer: 'Algorithm engineer',
  blockchain_engineer: 'Blockchain engineer',
  operations: 'Operations',
  quality_assurance_engineer: 'Quality assurance engineer ',
  architect: 'Architect',
  project_manager: 'Project manager',
  student: 'Student',
  others: 'Others',
  what_are_your_commonly_used_programming_languages:
    'What are your commonly used programming languages',
  approve: 'Approve',
  status_none: 'None',
  status_approved: 'Approved',
  status_pending: 'Pending',
  status_rejected: 'Rejected',
  all_user: 'All user',
  referee: 'Referee',
  admin: 'Admin',
  member: 'Member',
  please_select_at_least_one_user: 'Please select at least one user',
  confirm_to_delete_admin_or_referee:
    'Confirm to delete the selected admin/referee?',
  please_select_at_least_one_partner:
    'Please select at least one sponsor/partner!',
  confirm_to_delete_partner:
    'Are you sure to delete the selected sponsor/partner?',
  add: 'Add',
  search: 'Search',
  export: 'Export',
  all_works: 'All works',
  repository_name: 'Repository name',
  authorize_all_teammates: 'Authorize all teammates',
  instant_cloud_development: 'Instant cloud development',
  cloud_development_environment: 'Cloud development environment',
  creat_clound_environment: 'Create a development environment',
  team_registration: 'Team registration',
  role_management: 'Role Manage',
  submit_work: 'Submit work',
  upload_work: 'Upload work',
  upload_file: 'Upload file',
  work_type: 'Work type',
  edit_work: 'Edit Work',
  work_url: 'Work online link',
  confirm_delete_work: 'Are you sure you want to delete the work?',
  platform_management: 'Platform management',
  host: 'Host',
  undertake: 'Undertake',
  coorganizer: 'Coorganizer',
  sponsor: 'Sponsor',
  titlesponsor: 'Title Sponsor',
  basic_settings: 'Basic Settings',
  works_awards: 'Works Awards',
  add_sponsor_information: 'Add organizer information',
  sponsor_information: 'Sponsor Information',
  competition_location: 'Competition location',
  announcement: 'Announcement',
  advance_settings: 'Advanced settings',
  cloud_resource: 'Cloud resources',
  virtual_environment: 'Virtual Environment',
  environmental_monitoring: 'Environmental Monitoring',
  log: 'Log',
  website: 'Website',
  image: 'Image',
  video: 'Video',
  view_work: 'View Work',
  update_time: 'Update time',
  create_time: 'Create time',
  hacker_pavilion: 'Hacker Pavilion',
  mystery_hacker: 'Mystery Hacker',
  status: 'Status',
  role_type: 'Role Type',
  send: 'Send',
  search_an_user: 'Please search and select a user first',
  add_manager: 'Add administrator',
  create_work_success:
    'The event is successfully created, whether to apply for publishing the event',
  has_published:
    'An application has been made to publish the event, please wait for review',
  edited_success: 'Successfully modified',
  quote_required: '(required)',
  name_placeholder: 'Name, letters and numbers only',
  please_enter_name: 'Please enter a name',
  disaplay_name: 'Display Name',
  tag: 'Tag',
  tag_placeholder: 'tags, separated by spaces',
  bannerUrls: 'Head picture (required, up to 10)',
  enrollment: 'Registration Time',
  activity_time: 'Activity time',
  judge_time: 'Scoring time',
  ribbon: 'Advertising slogan',
  max_enrollment: 'Enrollment limit',
  max_enrollment_placeholder: '0 means infinite',
  activity_introduction: 'Introduction',
  sure_delete_this_work: 'Are you sure you want to delete this award?',
  apply_publish: 'Apply online',
  publish: 'Publish',
  offline: 'Offline',
  sure_publish: ({ name }: { name: string }) =>
    textJoin('Are you sure you want to publish', name, '?'),
  sure_offline: ({ name }: { name: string }) =>
    textJoin('do you want to go offline', name, '?'),
  activity_manage: 'Manage Activity',
  no_permission: 'No permission yet',
  sign_up_trends: 'Sign up trends',
  basic_info: 'Basic Information',
  city_distribution: 'City distribution',
  approval_status: 'Approval Status',
  custom_questionnaire: 'Custom questionnaire',
  access_preview: 'Access Preview',
  title: 'Title',
  content: 'Content',
  sure_delete_this_message: 'Are you sure you want to delete this message?',
  admin_management: 'Admin management',
  confirm_to_delete_platform_admin:
    'Confirm to delete the selected platform admin',
  profile: 'profile',
} as const;
