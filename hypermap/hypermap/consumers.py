from channels import Group
import json


def ws_add(message):
    message.reply_channel.send({"accept": True})
    Group("all_user").add(message.reply_channel)


# Connected to websocket.receive
def ws_message(message):
    Group("chat").send({
        "text": "[user] %s" % message.content['text'],
    })



# Connected to websocket.disconnect
def ws_disconnect(message):
    Group("chat").discard(message.reply_channel)