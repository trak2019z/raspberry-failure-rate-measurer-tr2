//--- Requires ---//
const nodemailer = require("nodemailer");

const User = require("../models/user");
const ServerRoom = require("../models/serverroom");
const Relation = require("../models/relation");

//-- Methods --//
exports.getDisabledAccounts = (request, response, next) => {
    User.find({ isActive: 0 })
    .then(users => {
        response.status(200).json({
            message: "Accounts collected correctly",
            accounts: users
        });
    })
    .catch(error => {
        response.status(500).json({
          message: "Collecting accounts failed"
        })
      })
}

exports.getActivatedAccounts = (request, response, next) => {
    User.find({ isActive: 1, isAdmin: 0 })
    .then(users => {
        response.status(200).json({
            message: "Accounts collected correctly",
            accounts: users
        });
    })
    .catch(error => {
        response.status(500).json({
          message: "Collecting accounts failed"
        })
      })
}

exports.getAccountsPrivileges = (request, response, next) => {
    User.find({ isAdmin: 0 })
    .then(users => {
        response.status(200).json({
            message: "Accounts collected correctly",
            accounts: users
        });
    })
    .catch(error => {
        response.status(500).json({
          message: "Collecting accounts failed"
        })
      })
}

exports.activateAccount = (request, response, next) => {
  User.updateOne({ _id: request.body.accountId }, { isActive: 1 }).then(result => {
    if(result.n > 0) {
      response.status(200).json({
        message: "Account activated successfully"
      })
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'fkuca91@gmail.com',
            pass: 'Smoki666'
          }
      })
      const mailOptions = {
        from: 'fkuca91@gmail.com',
        to: request.body.login,
        subject: 'RFRM - Account activated',
        text: 'Your account has been activated! Feel free to log in any time to RFRM!',
        replyTo: 'fkuca91@gmail.com'
      }
      transporter.sendMail(mailOptions, function(err, res) {
        if(err) {
            console.log('Nodemailer ERROR: ', err)
        } else {
            console.log('Nodemailer SUCCESS: ', res)
        }
      })
    } else {
      response.status(401).json({
        message: "Not authorized"
      })
    }
  })
  .catch(error => {
    response.status(500).json({
      message: "Internal server error"
    })
  })
}

exports.disableAccount = (request, response, next) => {
  User.updateOne({ _id: request.body.accountId }, { isActive: 0 }).then(result => {
    if(result.n > 0) {
      console.log(request)
      response.status(200).json({
        message: "Account disabled successfully"
      })
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'fkuca91@gmail.com',
            pass: 'Smoki666'
          }
      })
      const mailOptions = {
        from: 'fkuca91@gmail.com',
        to: request.body.login,
        subject: 'RFRM - Account disabled',
        text: 'Your account has been disabled! Contact with administrator if you dont know the reason.',
        replyTo: 'fkuca91@gmail.com'
      }
      transporter.sendMail(mailOptions, function(err, res) {
        if(err) {
            console.log('Nodemailer ERROR: ', err)
        } else {
            console.log('Nodemailer SUCCESS: ', res)
        }
      })
    } else {
      response.status(401).json({
        message: "Not authorized"
      })
    }
  })
  .catch(error => {
    response.status(500).json({
      message: "Internal server error"
    })
  })
}

exports.givePrivileges = (request, response, next) => {
  User.updateOne({ _id: request.body.accountId }, { isAdmin: 1 }).then(result => {
    if(result.n > 0) {
      response.status(200).json({
        message: "Administrator privileges granted successfully"
      })
    } else {
      response.status(401).json({
        message: "Not authorized"
      })
    }
  })
  .catch(error => {
    response.status(500).json({
      message: "Internal server error"
    })
  })
}

exports.createServerRoom = (request, response, next) => {
  ServerRoom.findOne({ name: request.body.name })
  .then(name => {
    if(name === null) {
      const serverroom = new ServerRoom({
        name: request.body.name,
        address: request.body.address,
        city: request.body.city
      })
      serverroom.save()
      .then(result => {
        response.status(201).json({
          code: 201,
          message: "Server room created",
          result: result
        });
      })
      .catch(err => {
        response.status(500).json({
            message: "Invalid authentication credentials"
        })
      })
    } else {
      return response.status(500).json({
        message: "Invalid authentication credentials"
      })
    }
  })
}

exports.getServerRooms = (request, response, next) => {
  ServerRoom.find()
  .then(serverrooms => {
    response.status(200).json({
        message: "Server rooms collected correctly",
        serverrooms: serverrooms
    });
  })
  .catch(error => {
      response.status(500).json({
        message: "Collecting server rooms failed"
      })
    })
}

exports.deleteServerRoom = (request, response, next) => {
  ServerRoom.deleteOne({name: request.params.id })
  .then(result => {
    if(result.n > 0) {
      response.status(200).json({
        message: "Server room deleted successfully"
      })
    } else {
      response.status(401).json({
        message: "Not authorized"
      })
    }
  })
  .catch(error => {
    response.status(500).json({
      message: "Deleting server room failed"
    })
  })
}

exports.createRelation = (request, response, next) => {
  Relation.findOne({ accountId: request.body.accountId, serverRoomName: request.body.serverRoomName })
  .then(relation => {
    if(relation === null) {
      const supervision = new Relation({
        accountId: request.body.accountId,
        serverRoomName: request.body.serverRoomName
      });
      supervision.save()
      .then(result => {
        response.status(201).json({
          code: 201,
          message: "Relation created successfully"
        })
        .catch(err => {
          response.status(500).json({
            message: "Invalid authentication credentials"
          })
        })
      })
    } else {
      return response.status(500).json({
        message: "Invalid authentication credentials"
      })
    }
  })
}

exports.deleteRelation = (request, response, next) => {
  Relation.deleteOne({ accountId: request.params.aId, serverRoomName: request.params.sName })
  .then(result => {
    if(result.n > 0) {
      response.status(200).json({
        message: "Supervision deleted successfully"
      })
    } else {
      response.status(401).json({
        message: "Not authorized"
      })
    }
  })
  .catch(error => {
    response.status(500).json({
      message: "Deleting supervision failed"
    })
  })
}