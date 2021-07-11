import { Question } from '../../model';
import { words } from '../../i18n';

export const questions: Question[] = [
    {
        title: words.what_is_your_occupation,
        options: [
            words.front_end_engineer,
            words.back_end_engineer,
            words.client_engineer,
            words.game_developerment_engineer,
            words.algorithm_engineer,
            words.blockchain_engineer,
            words.operations,
            words.quality_assurance_engineer,
            words.architect,
            words.project_manager,
            words.student,
            words.others
        ],
        multiple: true
    },
    {
        title: words.what_are_your_commonly_used_programming_languages,
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
            words.others
        ],
        multiple: true
    },
    {
        title: words.linkein_or_cv,
        type: 'url'
    },
    {
        title: words.social_media_account_or_twitter_or_weibo,
        type: 'url'
    },
    {
        title: words.which_of_these_particular_areas_are_you_interested_in_going_into_this_event
    },
    {
        title: words.what_do_you_hope_to_learn_from_the_workshops
    },
    {
        title: words.do_you_plan__on_hacking_solo_or_with_a_team,
        options: [words.yes, words.no_i_prefer_solo, words.no_i_have_a_team]
    },
    {
        title: words.would_you_be_open_to_having_a_beginner_join_your_team,
        options: [words.yes, words.no]
    },
    {
        title: words.anything_else_we_should_know_about_what_youre_looking_for_in_a_team_or_teammate
    }
];
