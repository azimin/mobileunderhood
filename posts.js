import fs from 'fs-extra';
import authors from './authors';
import d from './date-format';

const filterTimeline = (item)=> {
  return (item.text[0] !== '@') || (item.text.indexOf('@jsunderhood') === 0);
}
const formatTweet = (item, index)=> {
  var text = item.text;
  if (item.retweeted_status) {
    var rtAuthor = item.retweeted_status.user.screen_name;
    text = `RT @${rtAuthor}: ${item.retweeted_status.text}`;
  }
  return `${text} [${index}][${index}]`
};
const formatRef = (item, index)=> `[${index}]: https://twitter.com/jsunderhood/status/${item.id_str}`

const post = (author, post=true)=> {
  if (!post) { return; }

  author.tweets.reverse();
  author.tweets = author.tweets.filter(filterTimeline);

  const md = [
    `# @${author.username}`,
    `_${ d(author.tweets[0].created_at) }_`,
    author.tweets.map(formatTweet).join('\n\n'),
    author.tweets.map(formatRef).join('\n')
  ].join('\n\n');

  fs.outputFile(`./posts/${author.username}.md`, md, (err)=> console.log(`${author.username} done`))
}

authors.forEach((item)=> {
  fs.readJson(`dump/${item.username}.json`, (err, author)=> post(author, item.post))
});
