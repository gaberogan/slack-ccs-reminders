require('dotenv').config();
const { App } = require('@slack/bolt');
const { differenceInWeeks } = require('date-fns');

// Members, ids required for mentions
// Find user ids like this: https://www.workast.com/help/article/how-to-find-a-slack-user-id/
const Tommy = '<@U03GCNZKG3U>'
const Gabe = '<@U03FL4LNCRW>'
const Benji = '<@U03B81S4QEN>'
const Joshua = '<@UJNLRPGMS>'
const CJ = '<@U03DBHKAK9T>'
const Brett = '<@UT4SH1ZNX>'
const Burhan = '<@U042ENP5AKT>'
const Ahsan = '<@U04C4F8QBFE>'
const Artem = '<@U03740LFH6D>'
const Ken = '<@U0185215CGL>'
const Jesse = '<@U052VKWU1S5>'
const John = '<@U056RB01535>'
// const Tim = '<@U031MFG63FA>' - not in rotation

// See skills sheet to make rotations https://docs.google.com/spreadsheets/d/1RpI3L4dEzy9XLHY1Zi1o7MddlepGvM4XAg0H45iZ6iI/edit#gid=0
const rotation1 = [Tommy, Gabe, Benji, Joshua];
const rotation2 = [Jesse, Ken, John, Artem];
const rotation3 = [CJ, Burhan, Ahsan, Brett];

exports.handler = async () => {
  // We can change this but the script is currently designed same length rotations
  if (rotation1.length !== rotation2.length || rotation1.length !== rotation3.length) {
    throw new Error('Rotations should have the same length');
  }

  // Just a way to count weekdays
  const now = new Date();
  const weeksSinceEpoch = differenceInWeeks(now, new Date('2023-01-01'), /* Sunday */ { roundingMethod: 'floor' });
  const dayOfWeek = now.getDay() - 1;
  const weekdaysSinceEpoch = weeksSinceEpoch * 5 + dayOfWeek;

  // Pick reviewers
  const getReviewersByIndex = (index) => [rotation1[index], rotation2[index], rotation3[index]];
  const todayReviewers = getReviewersByIndex(weekdaysSinceEpoch % rotation1.length);
  const tomorrowReviewers = getReviewersByIndex((weekdaysSinceEpoch + 1) % rotation1.length);

  // Start slack bolt app and send message
  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  });

  await app.start();

  await app.client.chat.postMessage({
    channel: '#clientz-internal',
    text: `Today's reviewers: ${todayReviewers.join(', ')}.\nTomorrow's reviewers: ${tomorrowReviewers.join(', ')}.`,
  })

  await app.stop();
}
