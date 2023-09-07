require('dotenv').config()
const { App } = require('@slack/bolt')
const { differenceInWeeks } = require('date-fns')

// Members, ids required for mentions
// Find user ids like this: https://www.workast.com/help/article/how-to-find-a-slack-user-id/
const Tommy = '<@U03GCNZKG3U>'
const Gabe = '<@U03FL4LNCRW>'
const Joshua = '<@UJNLRPGMS>'
const Burhan = '<@U042ENP5AKT>'
const Ahsan = '<@U04C4F8QBFE>'
const Artem = '<@U03740LFH6D>'
const Jesse = '<@U052VKWU1S5>'
const John = '<@U056RB01535>'
const Denys = '<@U04QMGUR21L>'
const Roman = '<@U04PJ40BY4W>'
const Oleksandr = '<@U04SJTYKT2P>'
const Marko = '<@U04SK2D4GQJ>'
const Joseph = '<@U05BX30V37S>'
const Sam = '<@U05DLNWNBNV>'
const Timmy = '<@U05NTG07GRW>'
const Evan = '<@U05PTTK2QH5>'

// See skills sheet to make rotations https://docs.google.com/spreadsheets/d/1RpI3L4dEzy9XLHY1Zi1o7MddlepGvM4XAg0H45iZ6iI/edit#gid=0
const group1 = [Tommy, Oleksandr, Evan, Marko]
const group2 = [Gabe, Sam, Timmy, Burhan]
const group3 = [John, Joseph, Ahsan, Roman]
const group4 = [Joshua, Jesse, Artem, Denys]

const rotation = [group1, group2, group3, group4]

// Just a way to count weekdays
const getWeekdaysSinceEpoch = () => {
  const now = new Date()
  const weeksSinceEpoch = differenceInWeeks(now, new Date('2023-01-01'), /* Sunday */ { roundingMethod: 'floor' })
  const dayOfWeek = now.getDay() - 1
  return weeksSinceEpoch * 5 + dayOfWeek
}

exports.handler = async () => {
  // Pick reviewers
  const weekdaysSinceEpoch = getWeekdaysSinceEpoch()
  const todayReviewers = rotation[weekdaysSinceEpoch % rotation.length]
  const tomorrowReviewers = rotation[(weekdaysSinceEpoch + 1) % rotation.length]

  // Start slack bolt app and send message
  const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
  })

  await app.start()

  await app.client.chat.postMessage({
    channel: `#${process.env.SLACK_CHANNEL}`,
    text: `Today's reviewers: ${todayReviewers.join(', ')}.\nTomorrow's reviewers: ${tomorrowReviewers.join(', ')}.`,
  })

  await app.stop()
}
