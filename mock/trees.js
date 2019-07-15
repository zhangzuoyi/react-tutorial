let data = [
  {
    name: 'groupId',
    text: 'com.shenlan'
  },
  {
    name: 'artifactId',
    text: 'robot',
    attrs: {a1: 'a11', b1: 'b11', c1: 'c11'}
  },
  {
    name: 'version',
    text: '1.0',
    children: [
      {
        name: 'a',
        text: 'a'
      },
      {
        name: 'b',
        text: 'b'
      },
      {
        name: 'c',
        text: 'c'
      }
    ]
  }
];

export default {
  'get /api/trees': function (req, res, next) {
    setTimeout(() => {
      res.json({
        result: data,
      })
    }, 250)
  },
  'post /api/trees/add': function (req, res, next) {
    console.log(req.body)
    
    res.json({
      success: true
    });
  },
}
