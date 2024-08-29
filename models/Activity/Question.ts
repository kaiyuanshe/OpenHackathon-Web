import { i18n } from '../Base/Translation';

const { t } = i18n;

export interface Question {
  id?: string;
  title: string;
  options?: string[];
  multiple?: boolean;
  type?: 'text' | 'url';
  required?: boolean;
}

export const questions: Question[] = [
  {
    title: t('what_is_your_occupation'),
    options: [
      t('front_end_engineer'),
      t('back_end_engineer'),
      t('client_engineer'),
      t('game_developerment_engineer'),
      t('algorithm_engineer'),
      t('blockchain_engineer'),
      t('operations'),
      t('quality_assurance_engineer'),
      t('architect'),
      t('project_manager'),
      t('student'),
      t('others'),
    ],
    multiple: true,
  },
  {
    title: t('what_are_your_commonly_used_programming_languages'),
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
      t('others'),
    ],
    multiple: true,
  },
  {
    title: t('linkein_or_cv'),
    type: 'url',
  },
  {
    title: t('social_media_account_or_twitter_or_weibo'),
    type: 'url',
  },
  {
    title: t(
      'which_of_these_particular_areas_are_you_interested_in_going_into_this_event',
    ),
    type: 'text',
  },
  {
    title: t('what_do_you_hope_to_learn_from_the_workshops'),
    type: 'text',
  },
  {
    title: t('do_you_plan__on_hacking_solo_or_with_a_team'),
    options: [t('yes'), t('no_i_prefer_solo'), t('no_i_have_a_team')],
  },
  {
    title: t('would_you_be_open_to_having_a_beginner_join_your_team'),
    options: [t('yes'), t('no')],
  },
  {
    title: t(
      'anything_else_we_should_know_about_what_youre_looking_for_in_a_team_or_teammate',
    ),
    type: 'text',
  },
];
