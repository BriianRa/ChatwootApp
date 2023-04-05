import React, { Fragment, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { Icon, Text } from 'components';
import { MESSAGE_TYPES } from 'constants';

import { getTextSubstringWithEllipsis } from 'helpers';

const createStyles = theme => {
  const { spacing } = theme;
  return StyleSheet.create({
    itemView: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingTop: spacing.tiny,
    },
    icon: {
      marginRight: spacing.micro,
    },
  });
};

const propTypes = {
  content: PropTypes.string,
  messageType: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isPrivate: PropTypes.bool,
  unReadCount: PropTypes.number,
};

const findLastMessage = message => {
  return message ? getTextSubstringWithEllipsis(message, 34) : 'No content available';
};

function replaceMentionsWithUsernames(text) {
  const regex = /\[@([^\]]+)\]\(mention:\/\/user\/\d+\/([^\)]+)\)/g;
  // regex matches mentions in the format [@user_name](mention://user/user_id/user_name)
  const matches = text.matchAll(regex);
  let result = text;
  for (const match of matches) {
    const [fullMatch, username, userId] = match;
    const replacement = `@${decodeURIComponent(username)}`;
    result = result.replace(fullMatch, replacement);
  }
  return result;
}

const ConversationContent = ({ content, messageType, isPrivate, unReadCount }) => {
  // console.log('content', content);
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { colors } = theme;
  const message = replaceMentionsWithUsernames(content);
  console.log('message', content, message);

  return (
    <Fragment>
      {messageType === MESSAGE_TYPES.OUTGOING || messageType === MESSAGE_TYPES.ACTIVITY ? (
        <View>
          {messageType === MESSAGE_TYPES.OUTGOING && (
            <View style={styles.itemView}>
              {isPrivate ? (
                <View style={styles.icon}>
                  <Icon color={colors.text} icon="lock-closed-outline" size={14} />
                </View>
              ) : (
                <View style={styles.icon}>
                  <Icon color={colors.text} icon="arrow-reply-outline" size={14} />
                </View>
              )}
              {unReadCount ? (
                <Text semiBold sm numberOfLines={1} maxLength={8} color={colors.text}>
                  {findLastMessage(message)}
                </Text>
              ) : (
                <Text sm numberOfLines={1} maxLength={8} color={colors.text}>
                  {findLastMessage(message)}
                </Text>
              )}
            </View>
          )}
          {messageType === MESSAGE_TYPES.ACTIVITY && (
            <View style={styles.itemView}>
              <View style={styles.icon}>
                <Icon color={colors.text} icon="info-outline" size={14} />
              </View>
              {unReadCount ? (
                <Text semiBold sm numberOfLines={1} maxLength={8} color={colors.text}>
                  {getTextSubstringWithEllipsis(message, 32)}
                </Text>
              ) : (
                <Text sm numberOfLines={1} maxLength={8} color={colors.text}>
                  {getTextSubstringWithEllipsis(message, 32)}
                </Text>
              )}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.itemView}>
          {unReadCount ? (
            <Text semiBold sm numberOfLines={1} maxLength={8} color={colors.text}>
              {findLastMessage(message)}
            </Text>
          ) : (
            <Text sm numberOfLines={1} maxLength={8} color={colors.text}>
              {findLastMessage(message)}
            </Text>
          )}
        </View>
      )}
    </Fragment>
  );
};

ConversationContent.propTypes = propTypes;
export default ConversationContent;
