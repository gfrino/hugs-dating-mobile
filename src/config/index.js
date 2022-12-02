import React, { useContext } from 'react'
import { useTranslations } from 'dopenative'

const regexForNames = /^[a-zA-Z]{2,25}$/
const regexForPhoneNumber = /\d{9}$/
const regexForAge = /[0-9]/g

export const ConfigContext = React.createContext({})

export const ConfigProvider = ({ children }) => {
  const { localized } = useTranslations()
  const config = {
    isSMSAuthEnabled: false,
    appIdentifier: 'hugs-datings-android',
    facebookIdentifier: '308976414664335',
    webClientId:
      '525472070731-mg8m3q8v9vp1port7nkbq9le65hp917t.apps.googleusercontent.com',
    onboardingConfig: {
      welcomeTitle: localized('Find your soul mate'),
      welcomeCaption: localized(
        'Match and chat with people you like from your area',
      ),
      walkthroughScreens: [
        {
          icon: require('../assets/images/icon-bgless.png'),
          title: localized('Get a Date'),
          description: localized(
            'Swipe right to get a match with people you like from your area',
          ),
        },
        {
          icon: require('../assets/images/chat.png'),
          title: localized('Private Messages'),
          description: localized('Chat privately with people you match'),
        },
        {
          icon: require('../assets/images/instagram.png'),
          title: localized('Send Photos & Videos'),
          description: localized(
            'Have fun with your matches by sending photos and videos to each other',
          ),
        },
        {
          icon: require('../assets/images/notification.png'),
          title: localized('Get Notified'),
          description: localized(
            'Receive notifications when you get new messages and matches',
          ),
        },
      ],
    },
    tosLink: 'https://hugsdating.app/terms-of-use',
    isUsernameFieldEnabled: false,
    smsSignupFields: [
      {
        displayName: localized('First Name'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'firstName',
        placeholder: localized('First Name'),
      },
      {
        displayName: localized('Last Name'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'lastName',
        placeholder: localized('Last Name'),
      },
    ],
    signupFields: [
      {
        displayName: localized('First Name'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'firstName',
        placeholder: localized('First Name'),
      },
      {
        displayName: localized('Last Name'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'lastName',
        placeholder: localized('Last Name'),
      },
      {
        displayName: localized('E-mail Address'),
        type: 'email-address',
        editable: true,
        regex: regexForNames,
        key: 'email',
        placeholder: localized('E-mail Address'),
        autoCapitalize: 'none',
      },
      {
        displayName: localized('Password'),
        type: 'default',
        secureTextEntry: true,
        editable: true,
        regex: regexForNames,
        key: 'password',
        placeholder: localized('Password'),
        autoCapitalize: 'none',
      },
    ],
    privacyPolicyLink: 'https://hugsdating.app/privacy-policy/',
    editProfileFields: {
      sections: [
        {
          title: localized('PUBLIC PROFILE'),
          fields: [
            {
              displayName: localized('First Name'),
              type: 'text',
              editable: true,
              regex: regexForNames,
              key: 'firstName',
              placeholder: localized('Your first name'),
            },
            {
              displayName: localized('Last Name'),
              type: 'text',
              editable: true,
              regex: regexForNames,
              key: 'lastName',
              placeholder: localized('Your last name'),
            },
            {
              displayName: localized('Age'),
              type: 'text',
              editable: true,
              regex: regexForAge,
              key: 'age',
              placeholder: localized('Your age'),
            },
            {
              displayName: localized('Bio'),
              type: 'text',
              editable: true,
              key: 'bio',
              placeholder: localized('Your bio'),
            },
            {
              displayName: localized('School'),
              type: 'text',
              editable: true,
              key: 'school',
              placeholder: localized('Your bio'),
            },
            {
              displayName: localized('Current Location'),
              type: 'map',
              editable: true,
              key: 'location',
            },
            {
              displayName: localized('My category'),
              type: 'select',
              options: [
                'motor_disabilities',
                'psychic_disability',
                'sensory_disability',
                'no_disabilities',
              ],
              displayOptions: [
                'Motor disabilities',
                'Psychic disability',
                'Sensory disability',
                'No disabilities',
              ],
              editable: true,
              key: 'userCategory',
            },
          ],
        },
        {
          title: localized('PRIVATE DETAILS'),
          fields: [
            {
              displayName: localized('E-mail Address'),
              type: 'text',
              editable: false,
              key: 'email',
              placeholder: 'Your email address',
            },
            {
              displayName: localized('Phone Number'),
              type: 'text',
              editable: true,
              regex: regexForPhoneNumber,
              key: 'phone',
              placeholder: localized('Your phone number'),
            },
          ],
        },
      ],
    },
    userSettingsFields: {
      sections: [
        {
          title: localized('DISCOVERY'),
          fields: [
            {
              displayName: localized('Show me on Hugs Dating'),
              type: 'switch',
              editable: true,
              key: 'show_me',
              value: true,
            },
            {
              displayName: localized('Filter objectionable material'),
              type: 'switch',
              editable: true,
              key: 'filter_objectionable_material',
              value: false,
            },
            {
              displayName: localized('Distance Radius'),
              type: 'select',
              options: ['5', '10', '15', '25', '50', '100', 'unlimited'],
              displayOptions: [
                `5 ${localized('miles')}`,
                `10 ${localized('miles')}`,
                `15 ${localized('miles')}`,
                `25 ${localized('miles')}`,
                `50 ${localized('miles')}`,
                `100 ${localized('miles')}`,
                localized('Unlimited'),
              ],
              editable: true,
              key: 'distance_radius',
              value: 'Unlimited',
            },
            {
              displayName: localized('Gender'),
              type: 'select',
              options: ['female', 'male', 'none'],
              displayOptions: [
                localized('Female'),
                localized('Male'),
                localized('None'),
              ],
              editable: true,
              key: 'gender',
              value: 'None',
            },
            {
              displayName: localized('Gender Preference'),
              type: 'select',
              options: ['female', 'male', 'all'],
              displayOptions: [
                localized('Female'),
                localized('Male'),
                localized('All'),
              ],
              editable: true,
              key: 'gender_preference',
              value: 'All',
            },
            {
              displayName: localized('Category preference'),
              type: 'select',
              options: [
                'motor_disabilities',
                'psychic_disability',
                'sensory_disability',
                'no_disabilities',
                'all',
              ],
              displayOptions: [
                localized('Motor disabilities'),
                localized('Psychic disability'),
                localized('Sensory disability'),
                localized('No disabilities'),
                localized('All'),
              ],
              editable: true,
              key: 'category_preference',
            },
          ],
        },
        {
          title: localized('PUSH NOTIFICATIONS'),
          fields: [
            {
              displayName: localized('New Matches'),
              type: 'switch',
              editable: true,
              key: 'push_new_matches_enabled',
              value: true,
            },
            {
              displayName: localized('Messages'),
              type: 'switch',
              editable: true,
              key: 'push_new_messages_enabled',
              value: true,
            },
            {
              displayName: localized('Super Likes'),
              type: 'switch',
              editable: true,
              key: 'push_super_likes_enabled',
              value: true,
            },
            {
              displayName: localized('Top Picks'),
              type: 'switch',
              editable: true,
              key: 'push_top_picks_enabled',
              value: true,
            },
          ],
        },
        {
          title: '',
          fields: [
            {
              displayName: localized('Save'),
              type: 'button',
              key: 'savebutton',
            },
          ],
        },
      ],
    },
    contactUsFields: {
      sections: [
        {
          title: localized('CONTACT'),
          fields: [

            {
              displayName: localized('E-mail us'),
              value: 'hugs.datings@gmail.com',
              type: 'text',
              editable: false,
              key: 'email',
              placeholder: 'Your email address',
            },
          ],
        },
        {
          title: '',
          fields: [
            {
              displayName: localized('Call Us'),
              type: 'button',
              key: 'savebutton',
            },
          ],
        },
      ],
    },
    dailySwipeLimit: 10,
    totalSwipeLimit: 100,
    subscriptionSlideContents: [
      {
        title: localized('Go VIP'),
        // We need to add the dot after the localization in order for the localized() function to work
        description:
          localized(
            'When you subscribe, you get unlimited daily swipes, undo actions, VIP badge and more',
          ) + '.',
        src: require('../assets/images/fencing.png'),
      },
      {
        title: localized('Undo Actions'),
        description:
          localized('Get undo swipe actions when you subscribe') + '.',
        src: require('../assets/images/vip_1.png'),
      },
      {
        title: localized('Vip Badge'),
        description: localized(
          'Stand out with vip badge amongst other swipes when you subscribe',
        ),
        src: require('../assets/images/vip_2.png'),
      },
      {
        title: localized('Enjoy Unlimited Access'),
        description:
          localized('Get unlimited app access and more features to come') + '.',
        src: require('../assets/images/vip-pass.png'),
      },
    ],
    contactUsPhoneNumber: '+16504859694',
    IAP_SHARED_SECRET: '1feaf03495e9459086911bff458a69cf',
    IAP_SKUS: Platform.select({
      ios: [
        'app.hugsdating.NoFreeTrial.AutoRenewableSubscriptionByMonth'
      ],
      android: ['monthly_vip_subscription'],
    }),
    rooms: [
      {
        id: 'dating',
        name: localized('Dating'),
        description: localized('Find your other half'),
        image: require('../assets/rooms/dating.jpeg'),
      },
      {
        id: 'study',
        name: localized('Study'),
        description: localized('Spend time studying with a pal'),
        image: require('../assets/rooms/study.jpeg'),
      },
      {
        id: 'sports',
        name: localized('Sports'),
        description: localized('Have a great time, move your body!'),
        image: require('../assets/rooms/sport.jpeg'),
      },
      {
        id: 'travel',
        name: localized('Travel'),
        description: localized('Discover cool places with good company'),
        image: require('../assets/rooms/travel.jpeg'),
      },
      {
        id: 'cooking',
        name: localized('Cooking'),
        description: localized('Cook something delicious together'),
        image: require('../assets/rooms/cooking.jpeg'),
      },
      {
        id: 'artists',
        name: localized('Artists'),
        description: localized('Meet people who love art!'),
        image: require('../assets/rooms/artists.jpg'),
      },
    ],
  }

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}

export const useConfig = () => useContext(ConfigContext)

export const GOOGLE_MAPS_API_KEY = 'AIzaSyCD_v1EJ-dtlcHntoSIGcjdEkqs677T1SA'
