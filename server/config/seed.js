/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Student = require('../api/student/student.model');
var Tile = require('../api/tile/tile.model');

User.find({}).remove(function() {
  User.create({
      "_id": "5511a83da168f8b5f3144f02",
      "name": "Rosemarie Maxwell",
      "email": "rosemariemaxwell@plexia.com",
      "role": {
        "type": "user"
      },
      "password": "culpa",
      "contextPacks": [
        "Dolch 1",
        "Animals",
        "Post Office",
        "Lunch",
        "Superheros",
        "School",
        "Gym Class",
        "Trains",
        "Planes"
      ],
      "groupList": [
        {"groupName": "Group A",
        "contextPacks": ["Dolch 1", "Animals", "Gym Class"]
        },
        {"groupName": "Group B",
          "contextPacks": ["Superheros"]
        },
        {"groupName": "Group C",
          "contextPacks": ["Trains", "Planes"]
        },
        {"groupName": "Group D",
          "contextPacks": ["School"]
        },
        {"groupName": "Group E",
          "contextPacks": ["Lunch"]
        }],

      "tileBucket": ["5511ae8c72c6bb3a7f9cd910", "5511ae8c081ccbd0d072d7b4", "5511ae8ce28633ca8ad95f7f", "552c2418c7134c9a280c8048" , "552c24185768cb166a497fdb", "5511ae8c1fb25384d865e514", "5511ae8c127053ad5bf17926", "552c24180d441ed98f5c9b3b", "552c2418971878c01bab1e7c", "5511ae8c805b0d983f66e2cd", "552c2418684d651eee7cea6e", "552c24183b10b8ec888e042b", "552c2418f3a3808dd9765a0f", "552c2418291728ecd1d4667d", "5511ae8cec56277a4af216a5", "552c24180bb0fbbee3c0994b", "552c241885a79608d3f3ead5", "5511ae8cf6f121e4c3108cd6", "5511ae8cb5ac0ff225f5fde2", "5511ae8cfb1b2d41b9f92888", "552c2418e365512da04e88c6", "552c241822d53b21154c0cc0", "5511ae8c8b6533965921e512", "552c24181e58616ee17366ad",
        "552c2418c036ef35fe0bac32", "552d5c8011d58a4ad979d9b0", "552d5c80d6a8d78c5541b508", "552d5c80c0b37217fd3eded3", "552d5c80af62cb1c0a09f7bf"],
      "studentList": [
        {
          "firstName": "Cardenas",
          "lastName": "Coffey",
          "studentID": "5511ab56117e23f0412fd08f",
          "groupList": ["Group A", "Group B"],
          "contextTags": ["Gym Class", "Superheros", "Animals", "Dolch 1"]
        }, {
          "firstName": "Aisha",
          "lastName": "Wheeler",
          "studentID": "5511ab564ac02dbaf337270d",
          "groupList": ["Group A"],
          "contextTags": ["Dolch 1", "Animals", "Gym Class"]
        }, {
          "firstName": "Weiss",
          "lastName": "Tanner",
          "studentID": "5511ab5617fda1233df3f6dd",
          "groupList": ["Group A", "Group B", "Group E"],
          "contextTags": ["Gym Class", "Dolch 1", "Superheros", "Animals", "Lunch"]
        },


        {
          "firstName": "Burke",
          "lastName": "Mayer",
          "studentID": "552c20f8be17b267b77b5a19",
          "groupList": ["Group C", "Group D", "Group E"],
          "contextTags": ["Trains", "Planes", "School", "Lunch"]
        },{
          "firstName": "Mueller",
          "lastName": "David",
          "studentID": "552c20f8d1172952c6f268fe",
          "groupList": ["Group C", "Group B", "Group E"],
          "contextTags": ["Trains", "Planes", "Superheros", "Lunch"]
        },{
          "firstName": "Kimberley",
          "lastName": "Lloyd",
          "studentID": "552c20f878838eab8bf3f0b1",
          "groupList": ["Group D"],
          "contextTags": ["School"]
        },{
          "firstName": "Rodriguez",
          "lastName": "Madden",
          "studentID": "552c20f8b21be14535092a6a",
          "groupList": ["Group B", "Group C"],
          "contextTags": ["Superheros", "Trains", "Planes"]
        },{
          "firstName": "Garza",
          "lastName": "Massey",
          "studentID": "552c20f8c91389f9a90eea7e",
          "groupList": ["Group A"],
          "contextTags": ["Dolch 1", "Animals", "Gym Class"]
        },{
          "firstName": "Deloris",
          "lastName": "Alvarado",
          "studentID": "552c20f8842d066cb9945d93",
          "groupList": ["Group D", "Group A"],
          "contextTags": ["School", "Dolch 1", "Animals", "Gym Class"]
        },{
          "firstName": "Hahn",
          "lastName": "Melendez",
          "studentID": "552c20f835f5e056a3e3c932",
          "groupList": ["Group A", "Group B", "Group E"],
          "contextTags": ["Dolch 1", "Animals", "Gym Class", "Superheros", "Lunch"]
        },{
          "firstName": "Lucinda",
          "lastName": "Bass",
          "studentID": "552c20f8f403787cef74f326",
          "groupList": ["Group A", "Group C", "Group E"],
          "contextTags": ["Dolch 1", "Animals", "Gym Class", "Trains", "Planes", "Lunch"]
        },{
          "firstName": "James",
          "lastName": "Lester",
          "studentID": "552c20f81e2f0b90bb8b354a",
          "groupList": ["Group A", "Group B"],
          "contextTags": ["Dolch 1", "Animals", "Gym Class", "Superheros"]
        },{
          "firstName": "Marva",
          "lastName": "Mcgowan",
          "studentID": "552c20f8236b5a09d40cfaf0",
          "groupList": ["Group D", "Group C", "Group E"],
          "contextTags": ["Trains", "Planes", "School", "Lunch"]
        },{
          "firstName": "Jefferson",
          "lastName": "Bean",
          "studentID": "552c20f80645c32973a23dfc",
          "groupList": ["Group A", "Group D"],
          "contextTags": ["Dolch 1", "Animals", "Gym Class", "School"]
        },{
          "firstName": "Claire",
          "lastName": "Patterson",
          "studentID": "552c20f8daa1ff88495504d5",
          "groupList": [],
          "contextTags": []
        }
      ]
    },
    /////////////////////////////////////
    {
      "_id": "5511a83d70df99c5fdfa434f",
      "name": "Le Marshall",
      "email": "lemarshall@plexia.com",
      "role": {
        "type": "user"
      },
      "password": "commodo",
      "contextPacks": [
        "Malawi",
        "Norway",
        "Sao Tome and Principe",
        "Benin",
        "Antigua and Barbuda",
        "Seychelles",
        "Dominican Republic"
      ],
      "groupList": [
        {"groupName": "Pennsylvania",
          "contextPacks": []
        },
        {"groupName": "Louisiana",
          "contextPacks": []
        },
        {"groupName": "West Virginia",
          "contextPacks": []
        },
        {"groupName": "Minnesota",
          "contextPacks": []
        },
        {"groupName": "Delaware",
          "contextPacks": []
        }],
      "tileBucket": [],
      "studentList": []
    }
  );
});

Student.find({}).remove(function() {
  Student.create(
    {
      "_id": "5511ab56117e23f0412fd08f",
      "firstName": "Cardenas",
      "lastName": "Coffey",
      "artifacts": [],
      "teachers": [
      "5511a83da168f8b5f3144f02"
    ],
      "tileBucket": ["5511ae8cec56277a4af216a5", "5511ae8cec56277a4af216a5", "5511ae8c1fb25384d865e514", "5511ae8c72c6bb3a7f9cd910", "5511ae8c081ccbd0d072d7b4", "5511ae8c127053ad5bf17926", "5511ae8ce28633ca8ad95f7f", "5511ae8c8b6533965921e512"],
      "contextTags": [
      {
        "tagName": "Gym Class",
        "creatorID": "5511a83da168f8b5f3144f02"
      },
      {
        "tagName": "Superheros",
        "creatorID": "5511a83da168f8b5f3144f02"
      },
      {
        "tagName": "Animals",
        "creatorID": "5511a83da168f8b5f3144f02"
      },
      {
        "tagName": "Dolch 1",
        "creatorID": "5511a83da168f8b5f3144f02"
      }
    ]
    },

    {
      "_id": "5511ab564ac02dbaf337270d",
      "firstName": "Aisha",
      "lastName": "Wheeler",
      "artifacts": [],
      "teachers": [
      "5511a83da168f8b5f3144f02"
    ],
      "tileBucket": ["5511ae8c1fb25384d865e514", "5511ae8c72c6bb3a7f9cd910", "5511ae8c081ccbd0d072d7b4", "5511ae8c127053ad5bf17926", "5511ae8ce28633ca8ad95f7f", "5511ae8c8b6533965921e512"],
      "contextTags": [
      {
        "tagName": "Dolch 1",
        "creatorID": "5511a83da168f8b5f3144f02"
      },
      {
        "tagName": "Animals",
        "creatorID": "5511a83da168f8b5f3144f02"
      },
      {
        "tagName": "Gym Class",
        "creatorID": "5511a83da168f8b5f3144f02"
      }
    ]
    },

    {
      "_id": "5511ab5617fda1233df3f6dd",
      "firstName": "Weiss",
      "lastName": "Tanner",
      "artifacts": [],
      "teachers": [
      "5511a83da168f8b5f3144f02"
    ],
      "tileBucket": ["5511ae8cec56277a4af216a5", "5511ae8c1fb25384d865e514", "5511ae8c72c6bb3a7f9cd910", "5511ae8c081ccbd0d072d7b4", "5511ae8c127053ad5bf17926", "5511ae8ce28633ca8ad95f7f", "5511ae8c8b6533965921e512"],
      "contextTags": [
      {
        "tagName": "Dolch 1",
        "creatorID": "5511a83da168f8b5f3144f02"
      },
      {
        "tagName": "Superheros",
        "creatorID": "5511a83da168f8b5f3144f02"
      },
      {
        "tagName": "Animals",
        "creatorID": "5511a83da168f8b5f3144f02"
      },
      {
        "tagName": "Lunch",
        "creatorID": "5511a83da168f8b5f3144f02"
      },
        {"tagName": "Gym Class",
          "creatorID": "5511a83da168f8b5f3144f02"
        }
    ]
    },



    {
      "_id": "552c20f8be17b267b77b5a19",
      "firstName": "Burke",
      "lastName": "Mayer",
      "teachers": [
        "5511a83da168f8b5f3144f02"
      ],
      "tileBucket": ["552d5c8011d58a4ad979d9b0", "552d5c80d6a8d78c5541b508", "552d5c80c0b37217fd3eded3", "552d5c80af62cb1c0a09f7bf", "5511ae8cf6f121e4c3108cd6", "5511ae8cb5ac0ff225f5fde2", "5511ae8cfb1b2d41b9f92888", "552c2418e365512da04e88c6", "552c241822d53b21154c0cc0", "552c2418f3a3808dd9765a0f", "552c2418291728ecd1d4667d"],
      "contextTags": [
        {
          "tagName": "Trains",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Planes",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "School",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Lunch",
          "creatorID": "5511a83da168f8b5f3144f02"
        }
      ]
    },
    {
      "_id": "552c20f8d1172952c6f268fe",
      "firstName": "Mueller",
      "lastName": "David",
      "teachers": [
        "5511a83da168f8b5f3144f02"
      ],
      "tileBucket": ["552d5c8011d58a4ad979d9b0", "552d5c80d6a8d78c5541b508", "552d5c80c0b37217fd3eded3", "552d5c80af62cb1c0a09f7bf", "5511ae8cec56277a4af216a5", "552c24180bb0fbbee3c0994b", "552c241885a79608d3f3ead5", "552c2418f3a3808dd9765a0f", "552c2418291728ecd1d4667d"],
      "contextTags": [
        {
          "tagName": "Trains",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Planes",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Superheros",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Lunch",
          "creatorID": "5511a83da168f8b5f3144f02"
        }
      ]
    },
    {
      "_id": "552c20f878838eab8bf3f0b1",
      "firstName": "Kimberley",
      "lastName": "Lloyd",
      "teachers": [
        "5511a83da168f8b5f3144f02"
      ],
      "tileBucket": ["5511ae8cf6f121e4c3108cd6", "5511ae8cb5ac0ff225f5fde2", "5511ae8cfb1b2d41b9f92888", "552c2418e365512da04e88c6", "552c241822d53b21154c0cc0"],
      "contextTags": [
        {
          "tagName": "School",
          "creatorID": "5511a83da168f8b5f3144f02"
        }
      ]
    },
    {
      "_id": "552c20f8b21be14535092a6a",
      "firstName": "Rodriguez",
      "lastName": "Madden",
      "teachers": [
        "5511a83da168f8b5f3144f02"
      ],
      "tileBucket": ["5511ae8cec56277a4af216a5", "552c24180bb0fbbee3c0994b", "552c241885a79608d3f3ead5", "552d5c8011d58a4ad979d9b0", "552d5c80d6a8d78c5541b508", "552d5c80c0b37217fd3eded3", "552d5c80af62cb1c0a09f7bf"],
      "contextTags": [
        {
          "tagName": "Superheros",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Trains",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Planes",
          "creatorID": "5511a83da168f8b5f3144f02"
        }
      ]
    },
    {
      "_id": "552c20f8c91389f9a90eea7e",
      "firstName": "Garza",
      "lastName": "Massey",
      "teachers": [
        "5511a83da168f8b5f3144f02"
      ],
      "tileBucket": ["5511ae8c72c6bb3a7f9cd910", "5511ae8c081ccbd0d072d7b4", "5511ae8ce28633ca8ad95f7f", "552c2418c7134c9a280c8048" ,  "552c24185768cb166a497fdb", "5511ae8c1fb25384d865e514", "5511ae8c127053ad5bf17926", "552c24180d441ed98f5c9b3b", "552c2418971878c01bab1e7c", "5511ae8c8b6533965921e512", "552c24181e58616ee17366ad",
        "552c2418c036ef35fe0bac32"],
      "contextTags": [
        {
          "tagName": "Dolch 1",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Animals",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {"tagName": "Gym Class",
          "creatorID": "5511a83da168f8b5f3144f02"
        }
      ]
    },
    {
      "_id": "552c20f8842d066cb9945d93",
      "firstName": "Deloris",
      "lastName": "Alvarado",
      "teachers": [
        "5511a83da168f8b5f3144f02"
      ],
      "tileBucket": ["5511ae8c72c6bb3a7f9cd910", "5511ae8c081ccbd0d072d7b4", "5511ae8ce28633ca8ad95f7f", "552c2418c7134c9a280c8048" ,  "552c24185768cb166a497fdb", "5511ae8cf6f121e4c3108cd6", "5511ae8cb5ac0ff225f5fde2", "5511ae8cfb1b2d41b9f92888", "552c2418e365512da04e88c6", "552c241822d53b21154c0cc0", "5511ae8c1fb25384d865e514", "5511ae8c127053ad5bf17926", "552c24180d441ed98f5c9b3b", "552c2418971878c01bab1e7c", "5511ae8c8b6533965921e512", "552c24181e58616ee17366ad",
        "552c2418c036ef35fe0bac32"],
      "contextTags": [
        {
          "tagName": "Dolch 1",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "School",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Animals",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {"tagName": "Gym Class",
          "creatorID": "5511a83da168f8b5f3144f02"
        }
      ]
    },
    {
      "_id": "552c20f835f5e056a3e3c932",
      "firstName": "Hahn",
      "lastName": "Melendez",
      "teachers": [
        "5511a83da168f8b5f3144f02"
      ],
      "tileBucket": ["5511ae8c72c6bb3a7f9cd910", "5511ae8c081ccbd0d072d7b4", "5511ae8ce28633ca8ad95f7f", "552c2418c7134c9a280c8048" , "552c24185768cb166a497fdb", "5511ae8cec56277a4af216a5", "552c24180bb0fbbee3c0994b", "552c241885a79608d3f3ead5", "5511ae8c1fb25384d865e514", "5511ae8c127053ad5bf17926", "552c24180d441ed98f5c9b3b", "552c2418971878c01bab1e7c", "552c2418f3a3808dd9765a0f", "552c2418291728ecd1d4667d", "5511ae8c8b6533965921e512", "552c24181e58616ee17366ad",
        "552c2418c036ef35fe0bac32"],
      "contextTags": [
        {
          "tagName": "Dolch 1",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Superheros",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Animals",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Lunch",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {"tagName": "Gym Class",
          "creatorID": "5511a83da168f8b5f3144f02"
        }
      ]
    },
    {
      "_id": "552c20f8f403787cef74f326",
      "firstName": "Lucinda",
      "lastName": "Bass",
      "teachers": [
        "5511a83da168f8b5f3144f02"
      ],
      "tileBucket": ["5511ae8c72c6bb3a7f9cd910", "5511ae8c081ccbd0d072d7b4", "5511ae8ce28633ca8ad95f7f", "552c2418c7134c9a280c8048" , "552c24185768cb166a497fdb", "552d5c8011d58a4ad979d9b0", "552d5c80d6a8d78c5541b508", "552d5c80c0b37217fd3eded3", "552d5c80af62cb1c0a09f7bf", "5511ae8c1fb25384d865e514", "5511ae8c127053ad5bf17926", "552c24180d441ed98f5c9b3b", "552c2418971878c01bab1e7c", "552c2418f3a3808dd9765a0f", "552c2418291728ecd1d4667d", "5511ae8c8b6533965921e512", "552c24181e58616ee17366ad",
        "552c2418c036ef35fe0bac32"],
      "contextTags": [
        {
          "tagName": "Dolch 1",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Trains",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Planes",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Animals",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Lunch",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {"tagName": "Gym Class",
          "creatorID": "5511a83da168f8b5f3144f02"
        }
      ]
    },
    {
      "_id": "552c20f81e2f0b90bb8b354a",
      "firstName": "James",
      "lastName": "Lester",
      "teachers": [
        "5511a83da168f8b5f3144f02"
      ],
      "tileBucket": ["5511ae8c72c6bb3a7f9cd910", "5511ae8c081ccbd0d072d7b4", "5511ae8ce28633ca8ad95f7f", "552c2418c7134c9a280c8048" , "552c24185768cb166a497fdb", "5511ae8cec56277a4af216a5", "552c24180bb0fbbee3c0994b", "552c241885a79608d3f3ead5", "5511ae8c1fb25384d865e514", "5511ae8c127053ad5bf17926", "552c24180d441ed98f5c9b3b", "552c2418971878c01bab1e7c", "5511ae8c8b6533965921e512", "552c24181e58616ee17366ad",
        "552c2418c036ef35fe0bac32"],
      "contextTags": [
        {
          "tagName": "Dolch 1",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Superheros",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Animals",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {"tagName": "Gym Class",
          "creatorID": "5511a83da168f8b5f3144f02"
        }
      ]
    },
    {
      "_id": "552c20f8236b5a09d40cfaf0",
      "firstName": "Marva",
      "lastName": "Mcgowan",
      "teachers": [
        "5511a83da168f8b5f3144f02"
      ],
      "tileBucket": ["552d5c8011d58a4ad979d9b0", "552d5c80d6a8d78c5541b508", "5511ae8cf6f121e4c3108cd6", "5511ae8cb5ac0ff225f5fde2", "5511ae8cfb1b2d41b9f92888", "552c2418e365512da04e88c6", "552c241822d53b21154c0cc0", "552d5c80c0b37217fd3eded3", "552d5c80af62cb1c0a09f7bf", "552c2418f3a3808dd9765a0f", "552c2418291728ecd1d4667d"],
      "contextTags": [
        {
          "tagName": "Trains",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "School",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Planes",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Lunch",
          "creatorID": "5511a83da168f8b5f3144f02"
        }
      ]
    },
    {
      "_id": "552c20f80645c32973a23dfc",
      "firstName": "Jefferson",
      "lastName": "Bean",
      "teachers": [
        "5511a83da168f8b5f3144f02"
      ],
      "tileBucket": ["5511ae8c72c6bb3a7f9cd910", "5511ae8c081ccbd0d072d7b4", "5511ae8ce28633ca8ad95f7f", "552c2418c7134c9a280c8048" , "552c24185768cb166a497fdb", "5511ae8cf6f121e4c3108cd6", "5511ae8cb5ac0ff225f5fde2", "5511ae8cfb1b2d41b9f92888", "552c2418e365512da04e88c6", "552c241822d53b21154c0cc0", "5511ae8c1fb25384d865e514", "5511ae8c127053ad5bf17926", "552c24180d441ed98f5c9b3b", "552c2418971878c01bab1e7c", "5511ae8c8b6533965921e512", "552c24181e58616ee17366ad",
        "552c2418c036ef35fe0bac32"],
      "contextTags": [
        {
          "tagName": "Dolch 1",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "School",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {
          "tagName": "Animals",
          "creatorID": "5511a83da168f8b5f3144f02"
        },
        {"tagName": "Gym Class",
          "creatorID": "5511a83da168f8b5f3144f02"
        }
      ]
    },
    {
      "_id": "552c20f8daa1ff88495504d5",
      "firstName": "Claire",
      "lastName": "Patterson",
      "teachers": [
        "5511a83da168f8b5f3144f02"
      ],
      "tileBucket": [],
      "contextTags": []
    }
  )
});



Tile.find({}).remove(function() {
  Tile.create({

    "_id": "5511ae8c805b0d983f66e2cd",
    "name": "Mail",
      "creatorID": "5511a83da168f8b5f3144f02",
    "contextTags": [
    {
      "tagName": "Post Office"
    }
  ],
    "active": false,
      "wordType": "Noun"
  },
  {
    "_id": "5511ae8cec56277a4af216a5",
    "name": "Batman",
    "creatorID": "5511a83da168f8b5f3144f02",
    "contextTags": [
      {
      "tagName": "Superheros"
    }
  ],
    "active": false,
    "wordType": "Noun"
  },
  {
    "_id": "5511ae8c1fb25384d865e514",
    "name": "Dog",
    "creatorID": "5511a83da168f8b5f3144f02",
    "contextTags": [
    {
      "tagName": "Animals"
    }
  ],
    "active": false,
    "wordType": "Noun"
  },
  {
    "_id": "5511ae8cf6f121e4c3108cd6",
    "name": "Book",
    "creatorID": "5511a83da168f8b5f3144f02",
    "contextTags": [
    {
      "tagName": "School"
    }
  ],
    "active": false,
    "wordType": "Noun"
  },
  {
    "_id": "5511ae8cb5ac0ff225f5fde2",
    "name": "Pencil",
    "creatorID": "5511a83da168f8b5f3144f02",
    "contextTags": [
    {
      "tagName": "School"
    }
  ],
    "active": false,
    "wordType": "Noun"
  },
  {
    "_id": "5511ae8c72c6bb3a7f9cd910",
    "name": "Jump",
    "creatorID": "5511a83da168f8b5f3144f02",
    "contextTags": [
    {
      "tagName": "Dolch 1"
    }
  ],
    "active": false,
    "wordType": "Verb"
  },
  {
    "_id": "5511ae8c081ccbd0d072d7b4",
    "name": "Run",
    "creatorID": "5511a83da168f8b5f3144f02",
    "contextTags": [
    {
      "tagName": "Dolch 1"
    }
  ],
    "active": false,
    "wordType": "Verb"
  },
  {
    "_id": "5511ae8cfb1b2d41b9f92888",
    "name": "Desk",
    "creatorID": "5511a83da168f8b5f3144f02",
    "contextTags": [
    {
      "tagName": "School"
    }
  ],
    "active": false,
    "wordType": "Noun"
  },
  {
    "_id": "5511ae8c127053ad5bf17926",
    "name": "Cat",
    "creatorID": "5511a83da168f8b5f3144f02",
    "contextTags": [
    {
      "tagName": "Animals"
    }
  ],
    "active": false,
    "wordType": "Noun"
  },
  {
    "_id": "5511ae8ce28633ca8ad95f7f",
    "name": "House",
    "creatorID": "5511a83da168f8b5f3144f02",
    "contextTags": [
    {
      "tagName": "Dolch 1"
    }
  ],
    "active": false,
    "wordType": "Noun"
  },
  {
    "_id": "5511ae8c8b6533965921e512",
    "name": "Ball",
    "creatorID": "5511a83da168f8b5f3144f02",
    "contextTags": [
    {
      "tagName": "Gym Class"
    }
  ],
    "active": false,
    "wordType": "Noun"

  },
    {
      "_id": "552c2418c7134c9a280c8048",
      "name": "a",
      "creatorID": "5511a83da168f8b5f3144f02",
      "contextTags": [
        {
          "tagName": "Dolch 1"
        }
      ],
      "active": false,
      "wordType": "Article"
    },
    {
      "_id": "552c24180d441ed98f5c9b3b",
      "name": "bear",
      "creatorID": "5511a83da168f8b5f3144f02",
      "contextTags": [
        {
          "tagName": "Animals"
        }
      ],
      "active": false,
      "wordType": "Noun"
    },
    {
      "_id": "552c2418684d651eee7cea6e",
      "name": "stamp",
      "creatorID": "5511a83da168f8b5f3144f02",
      "contextTags": [
        {
          "tagName": "Post Office"
        }
      ],
      "active": false,
      "wordType": "Noun"
    },
    {
      "_id": "552c2418f3a3808dd9765a0f",
      "name": "eat",
      "creatorID": "5511a83da168f8b5f3144f02",
      "contextTags": [
        {
          "tagName": "Lunch"
        }
      ],
      "active": false,
      "wordType": "Verb"
    },
    {
      "_id": "552c24180bb0fbbee3c0994b",
      "name": "Iron Man",
      "creatorID": "5511a83da168f8b5f3144f02",
      "contextTags": [
        {
          "tagName": "Superheros"
        }
      ],
      "active": false,
      "wordType": "Noun"
    },
    {
      "_id": "552c2418e365512da04e88c6",
      "name": "teacher",
      "creatorID": "5511a83da168f8b5f3144f02",
      "contextTags": [
        {
          "tagName": "School"
        }
      ],
      "active": false,
      "wordType": "Noun"
    },
    {
      "_id": "552c24181e58616ee17366ad",
      "name": "catch",
      "creatorID": "5511a83da168f8b5f3144f02",
      "contextTags": [
        {
          "tagName": "Gym Class"
        }
      ],
      "active": false,
      "wordType": "Verb"
    },
    {
      "_id": "552c24185768cb166a497fdb",
      "name": "and",
      "creatorID": "5511a83da168f8b5f3144f02",
      "contextTags": [
        {
          "tagName": "Dolch 1"
        }
      ],
      "active": false,
      "wordType": "Conjunction"
    },
    {
      "_id": "552c2418971878c01bab1e7c",
      "name": "giraffe",
      "creatorID": "5511a83da168f8b5f3144f02",
      "contextTags": [
        {
          "tagName": "Animals"
        }
      ],
      "active": false,
      "wordType": "noun"
    },
    {
      "_id": "552c24183b10b8ec888e042b",
      "name": "send",
      "creatorID": "5511a83da168f8b5f3144f02",
      "contextTags": [
        {
          "tagName": "Post Office"
        }
      ],
      "active": false,
      "wordType": "Verb"
    },
    {
      "_id": "552c2418291728ecd1d4667d",
      "name": "apple",
      "creatorID": "5511a83da168f8b5f3144f02",
      "contextTags": [
        {
          "tagName": "Lunch"
        }
      ],
      "active": false,
      "wordType": "Noun"
    },
    {
      "_id": "552c241885a79608d3f3ead5",
      "name": "Captain America",
      "creatorID": "5511a83da168f8b5f3144f02",
      "contextTags": [
        {
          "tagName": "Superheros"
        }
      ],
      "active": false,
      "wordType": "Noun"
    },
    {
      "_id": "552c241822d53b21154c0cc0",
      "name": "bus",
      "creatorID": "5511a83da168f8b5f3144f02",
      "contextTags": [
        {
          "tagName": "School"
        }
      ],
      "active": false,
      "wordType": "Noun"
    },
    {
      "_id": "552c2418c036ef35fe0bac32",
      "name": "fast",
      "creatorID": "5511a83da168f8b5f3144f02",
      "contextTags": [
        {
          "tagName": "Gym Class"
        }
      ],
      "active": false,
      "wordType": "Adjective"
    },


    {
    "_id": "552d5c8011d58a4ad979d9b0",
      "name": "Conductor",
      "contextTags": [
      {
        "tagName": "Trains",
        "creatorID": "5511a83da168f8b5f3144f02"
      }
    ],
      "active": false,
      "wordType": "Noun"
  },
  {
    "_id": "552d5c80d6a8d78c5541b508",
    "name": "Steam",
    "contextTags": [
    {
      "tagName": "Trains",
      "creatorID": "5511a83da168f8b5f3144f02"
    }
  ],
    "active": false,
    "wordType": "Noun"
  },
  {
    "_id": "552d5c80c0b37217fd3eded3",
    "name": "Pilot",
    "contextTags": [
    {
      "tagName": "Planes",
      "creatorID": "5511a83da168f8b5f3144f02"
    }
  ],
    "active": false,
    "wordType": "Noun"
  },
  {
    "_id": "552d5c80af62cb1c0a09f7bf",
    "name": "Fly",
    "contextTags": [
    {
      "tagName": "Planes",
      "creatorID": "5511a83da168f8b5f3144f02"
    }
  ],
    "active": false,
    "wordType": "Verb"
  }

  )
});

