import * as React from 'react';
import {
  Flex,
  useStyleConfig,
  useStyles,
  Tooltip,
  IconButton,
  Heading,
  Text,
} from '@chakra-ui/react';
import { /*EllipsisVIcon, SmileIconRegular, ReplyIcon,*/ XIcon } from '../../icon';
import { MyAlertDialog } from '../../alertdialog';

interface SideButtonsProps {
  // onSmileClick?: React.MouseEventHandler<HTMLButtonElement>,
  // onReplyClick?: React.MouseEventHandler<HTMLButtonElement>,
  // onOptionsClick?: React.MouseEventHandler<HTMLButtonElement>,
  onRemoveClick: React.MouseEventHandler<HTMLButtonElement>,
}
export const SideButtons: React.FC<SideButtonsProps> = ({
  // onSmileClick, 
  // onReplyClick, 
  // onOptionsClick, 
  onRemoveClick
}) => {
  const [openDelete, setOpenDelete] = React.useState(false);

  const iconStyles = useStyleConfig("Icon", { variant: "sideMsgButton" })
  const tooltipStyles = useStyleConfig("Tooltip", {variant: "sideMsgButton"})
  const parentStyles = useStyles();

  return (
    <Flex sx={parentStyles.sideButtons}>
      
      <Tooltip
        label="Remove"
        placement="top"
        sx={tooltipStyles}
      >
        <span>
          <IconButton
            aria-label="react"
            isRound
            size="xs"
            sx={iconStyles}
            icon={<XIcon/>}  
            onClick={(): void => setOpenDelete(true)}
          />
        </span>
      </Tooltip>
      <MyAlertDialog
        header="Would you like to remove this message?"
        cancelButtonText="Cancel"
        okayButtonText="Remove"
        isOpen={openDelete}
        onClose={(): void => {setOpenDelete(false)}}
        onOkayClick={onRemoveClick}
      >
        <Heading fontSize="md">Unsend for everyone</Heading> 
        <Text color="gray.500" fontSize="md">
          You'll permanently remove this message for all chat members. They can see that you've unsent a message.
        </Text>
      </MyAlertDialog>
      {/* <Tooltip
        label="React"
        placement="top"
        sx={tooltipStyles}
      >
        <span>
          <IconButton
            aria-label="react"
            isRound
            size="xs"
            sx={iconStyles}
            icon={<SmileIconRegular onClick={onSmileClick}/>}  
          />
        </span>
      </Tooltip>
      <Tooltip
        label="Reply"
        placement="top"
        sx={tooltipStyles}
      >
        <span>
          <IconButton
            aria-label="react"
            isRound
            size="xs"
            sx={iconStyles}
            icon={<ReplyIcon onClick={onReplyClick}/>}
          />
        </span>
      </Tooltip>
      <Tooltip
        label="More"
        placement="top"
        sx={tooltipStyles}
      >
        <span>
          <IconButton
            aria-label="react"
            isRound
            size="xs"
            sx={iconStyles}
            icon={<EllipsisVIcon onClick={onOptionsClick}/>}
          />
        </span>
      </Tooltip> */}
    </Flex>
  );
}