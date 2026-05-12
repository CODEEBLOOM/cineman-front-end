import {
  extractMembershipRankList,
  findAllMembershipRanks,
  normalizeMembershipRank,
  upgradeMembershipForUser,
} from '@apis/membershipRankService';
import { findAllUserPointHistory } from '@apis/userPointHistoryService';
import AccountBalanceWalletRounded from '@mui/icons-material/AccountBalanceWalletRounded';
import ArrowUpwardRounded from '@mui/icons-material/ArrowUpwardRounded';
import CardMembershipRounded from '@mui/icons-material/CardMembershipRounded';
import StarsRounded from '@mui/icons-material/StarsRounded';
import TollRounded from '@mui/icons-material/TollRounded';
import TrendingUpRounded from '@mui/icons-material/TrendingUpRounded';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { accountPrimaryButtonSx } from '@component/account-customer/accountUiStyles';
import { formatNumber } from '@libs/Utils';
import { fetchInfoUser } from '@redux/slices/userSlice';
import DateFormatter from '@utils/DateFormatter';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const shellPaperSx = {
  borderRadius: '16px',
  border: '1px solid rgba(148,163,184,0.18)',
  backgroundColor: '#fff',
  boxShadow: '0 14px 34px rgba(15,23,42,0.08)',
};

const statPaperSx = {
  ...shellPaperSx,
  p: 2,
};

const progressTrackSx = {
  height: 10,
  borderRadius: 999,
  backgroundColor: alpha('#083d7c', 0.12),
  '& .MuiLinearProgress-bar': {
    borderRadius: 999,
    background: 'linear-gradient(90deg, #083d7c 0%, #0a4d9c 100%)',
  },
};

const historyCellSx = {
  borderBottomColor: alpha('#cbd5e1', 0.7),
  py: 1.5,
  px: 1.5,
  fontSize: 14,
};

const buildMemberCode = (userId) => {
  const raw = String(userId || '0').padStart(12, '0');
  const visible = raw.slice(-3);
  return `*********${visible}`;
};

const sortMembershipRanks = (ranks) =>
  [...ranks].sort(
    (left, right) =>
      Number(left?.requiredPoint ?? 0) - Number(right?.requiredPoint ?? 0)
  );

const resolveCurrentRank = (ranks, user, currentPoint) => {
  if (!ranks.length) {
    return null;
  }

  const matchById = ranks.find(
    (rank) =>
      rank?.id &&
      user?.membershipRank?.id &&
      Number(rank.id) === Number(user.membershipRank.id)
  );

  if (matchById) {
    return matchById;
  }

  const matchByName = ranks.find(
    (rank) =>
      rank?.name &&
      user?.membershipRank?.name &&
      rank.name.toLowerCase() === user.membershipRank.name.toLowerCase()
  );

  if (matchByName) {
    return matchByName;
  }

  return (
    [...ranks]
      .reverse()
      .find((rank) => currentPoint >= Number(rank?.requiredPoint ?? 0)) ?? ranks[0]
  );
};

const resolveNextRank = (ranks, currentRankId) =>
  ranks.find((rank) => Number(rank?.id) !== Number(currentRankId));

const MembershipCard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [historyPoints, setHistoryPoints] = useState([]);
  const [membershipRanks, setMembershipRanks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.allSettled([
      findAllMembershipRanks(),
      findAllUserPointHistory(user.userId),
    ])
      .then(([membershipResult, historyResult]) => {
        if (!isMounted) {
          return;
        }

        if (membershipResult.status === 'fulfilled') {
          setMembershipRanks(
            sortMembershipRanks(
              extractMembershipRankList(membershipResult.value).map(
                normalizeMembershipRank
              )
            )
          );
        }

        if (historyResult.status === 'fulfilled') {
          const historyPayload = historyResult.value?.data ?? historyResult.value ?? [];
          setHistoryPoints(Array.isArray(historyPayload) ? historyPayload : []);
        }

        if (
          membershipResult.status !== 'fulfilled' &&
          historyResult.status !== 'fulfilled'
        ) {
          toast.error('Không thể tải thông tin thẻ thành viên!');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [user.userId, reloadKey]);

  const totalPoint = useMemo(
    () =>
      historyPoints.reduce(
        (total, point) => total + (point.changePoint > 0 ? point.changePoint : 0),
        0
      ),
    [historyPoints]
  );

  const usedPoint = useMemo(
    () =>
      historyPoints.reduce(
        (total, point) =>
          total + (point.changePoint < 0 ? Math.abs(point.changePoint) : 0),
        0
      ),
    [historyPoints]
  );

  const availablePoint = Math.max(totalPoint - usedPoint, 0);
  const currentRank = resolveCurrentRank(membershipRanks, user, availablePoint);
  const currentRankIndex = membershipRanks.findIndex(
    (rank) => Number(rank?.id) === Number(currentRank?.id)
  );
  const nextRank =
    currentRankIndex >= 0 ? membershipRanks[currentRankIndex + 1] : membershipRanks[1];
  const highestRequiredPoint =
    membershipRanks[membershipRanks.length - 1]?.requiredPoint ?? 0;
  const progressPercent =
    highestRequiredPoint > 0
      ? Math.min((availablePoint / highestRequiredPoint) * 100, 100)
      : 0;
  const pointsToNextRank = Math.max(
    Number(nextRank?.requiredPoint ?? 0) - availablePoint,
    0
  );
  const canUpgradeMembership =
    Boolean(user?.userId) && Boolean(nextRank?.id) && pointsToNextRank === 0;

  const rankMilestones = membershipRanks.map((rank) => {
    const denominator = highestRequiredPoint || 1;
    return {
      ...rank,
      offsetPercent: Math.min((Number(rank.requiredPoint) / denominator) * 100, 100),
    };
  });

  const historyRows = useMemo(
    () =>
      [...historyPoints]
        .sort(
          (left, right) =>
            new Date(right?.createdAt || 0).getTime() -
            new Date(left?.createdAt || 0).getTime()
        )
        .slice(0, 6),
    [historyPoints]
  );

  const handleUpgradeMembership = async () => {
    if (!nextRank) {
      toast.info('Bạn đang ở hạng thành viên cao nhất.');
      return;
    }

    if (!canUpgradeMembership) {
      toast.info(
        `Cần thêm ${formatNumber(pointsToNextRank)} điểm để đạt hạng ${nextRank.name}.`
      );
      return;
    }

    try {
      setIsUpgrading(true);
      await upgradeMembershipForUser(user.userId, nextRank.id);
      await dispatch(fetchInfoUser()).unwrap();
      setReloadKey((prev) => prev + 1);
      toast.success(`Đã nâng hạng thành công lên ${nextRank.name}.`);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Không thể nâng hạng thành viên!'
      );
    } finally {
      setIsUpgrading(false);
    }
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography
          variant="h5"
          sx={{
            color: '#1e293b',
            fontSize: { xs: 22, md: 26 },
            fontWeight: 700,
          }}
        >
          Thành viên
        </Typography>
        <Typography sx={{ mt: 0.75, color: '#64748b', fontSize: 14.5 }}>
          Theo dõi cấp độ thẻ, tiến trình nâng hạng và lịch sử tích điểm của bạn.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', lg: '360px minmax(0, 1fr)' },
        }}
      >
        <Paper sx={{ ...shellPaperSx, p: { xs: 2.25, md: 2.5 } }}>
          <Stack spacing={2}>
            <Box
              sx={{
                borderRadius: '16px',
                p: 2.5,
                minHeight: 206,
                color: '#1e293b',
                background:
                  'linear-gradient(135deg, rgba(219,234,254,0.95) 0%, rgba(255,255,255,1) 42%, rgba(255,237,213,0.92) 100%)',
                border: '1px solid rgba(255,255,255,0.75)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(circle at top left, rgba(10,77,156,0.16), transparent 40%), radial-gradient(circle at bottom right, rgba(207,109,5,0.16), transparent 38%)',
                }}
              />
              <Stack
                spacing={1.5}
                sx={{ position: 'relative', height: '100%', justifyContent: 'space-between' }}
              >
                <Typography
                  sx={{
                    textAlign: 'center',
                    fontSize: 18,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#062d5c',
                  }}
                >
                  Thẻ thành viên
                </Typography>

                <Avatar
                  sx={{
                    mx: 'auto',
                    width: 68,
                    height: 68,
                    bgcolor: alpha('#083d7c', 0.12),
                    color: '#083d7c',
                  }}
                >
                  <CardMembershipRounded sx={{ fontSize: 36 }} />
                </Avatar>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 13, color: '#64748b' }}>
                    Cấp độ hiện tại
                  </Typography>
                  <Typography sx={{ mt: 0.5, fontSize: 28, fontWeight: 800, color: '#062d5c' }}>
                    {(currentRank?.name ?? 'Normal').toUpperCase()}
                  </Typography>
                  <Typography sx={{ mt: 0.75, fontSize: 15, fontWeight: 600 }}>
                    Mã số: {buildMemberCode(user?.userId)}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Typography sx={{ fontSize: 14, lineHeight: 1.7, color: '#64748b' }}>
              Hoàn điểm vé:{' '}
              <strong>{((currentRank?.returnPointsTicket ?? 0) * 100).toFixed(1)}%</strong>
              {' '}| Hoàn điểm snack:{' '}
              <strong>{((currentRank?.returnPointsSnack ?? 0) * 100).toFixed(1)}%</strong>
            </Typography>
          </Stack>
        </Paper>

        <Paper sx={{ ...shellPaperSx, p: { xs: 2.25, md: 2.5 } }}>
          <Stack spacing={2.5}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1.5,
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#1e293b' }}>
                  Tiến trình nâng hạng
                </Typography>
                <Typography sx={{ mt: 0.5, fontSize: 14, color: '#64748b' }}>
                  {nextRank
                    ? pointsToNextRank === 0
                      ? `Bạn đã đủ điều kiện để nâng lên hạng ${nextRank.name}.`
                      : `Còn ${formatNumber(pointsToNextRank)} điểm để đạt hạng ${nextRank.name}.`
                    : 'Bạn đang ở hạng thành viên cao nhất.'}
                </Typography>
              </Box>

              <Chip
                label={`${formatNumber(availablePoint)} điểm`}
                sx={{
                  height: 34,
                  borderRadius: '10px',
                  bgcolor: alpha('#083d7c', 0.1),
                  color: '#083d7c',
                  fontWeight: 700,
                }}
              />
            </Box>

            <Box sx={{ px: { xs: 0.5, md: 1 } }}>
              <Box
                sx={{
                  position: 'relative',
                  px: 0.5,
                  pt: 3.5,
                  pb: 1.5,
                }}
              >
                <LinearProgress
                  variant={isLoading ? 'indeterminate' : 'determinate'}
                  value={progressPercent}
                  sx={progressTrackSx}
                />

                {rankMilestones.map((rank) => (
                  <Box
                    key={rank.id}
                    sx={{
                      position: 'absolute',
                      left: `calc(${rank.offsetPercent}% - 1px)`,
                      top: 30,
                      width: 2,
                      height: 26,
                      bgcolor:
                        Number(rank?.id) === Number(currentRank?.id)
                          ? '#083d7c'
                          : alpha('#64748b', 0.45),
                    }}
                  />
                ))}

                {rankMilestones.map((rank) => {
                  const isCurrent = Number(rank?.id) === Number(currentRank?.id);

                  return (
                    <Box
                      key={`${rank.id}-label`}
                      sx={{
                        position: 'absolute',
                        left: `calc(${rank.offsetPercent}% - 32px)`,
                        top: 0,
                        width: 64,
                        textAlign: 'center',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: isCurrent ? '#083d7c' : '#475569',
                        }}
                      >
                        {rank.name}
                      </Typography>
                      <Typography sx={{ fontSize: 12.5, color: '#64748b' }}>
                        {formatNumber(rank.requiredPoint)}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                startIcon={<ArrowUpwardRounded />}
                onClick={handleUpgradeMembership}
                disabled={isUpgrading || !nextRank}
                sx={{
                  ...accountPrimaryButtonSx,
                  px: 4,
                  minWidth: 250,
                  background: 'linear-gradient(90deg, #083d7c 0%, #cf6d05 100%)',
                  boxShadow: '0 12px 26px rgba(35,72,108,0.18)',
                }}
              >
                {isUpgrading
                  ? 'Đang nâng hạng...'
                  : !nextRank
                    ? 'Đã ở hạng cao nhất'
                    : canUpgradeMembership
                      ? 'Nâng cấp hạng ngay'
                      : 'Chưa đủ điểm để nâng hạng'}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
        }}
      >
        {[
          {
            title: 'Điểm đã tích lũy',
            value: `${formatNumber(totalPoint)} Điểm`,
            icon: <TrendingUpRounded />,
            color: '#083d7c',
            bg: alpha('#083d7c', 0.08),
          },
          {
            title: 'Điểm đã sử dụng',
            value: `${formatNumber(usedPoint)} Điểm`,
            icon: <StarsRounded />,
            color: '#64748b',
            bg: alpha('#64748b', 0.08),
          },
          {
            title: 'Điểm còn lại',
            value: `${formatNumber(availablePoint)} Điểm`,
            icon: <AccountBalanceWalletRounded />,
            color: '#cf6d05',
            bg: alpha('#cf6d05', 0.1),
          },
        ].map((item) => (
          <Paper key={item.title} sx={statPaperSx}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: item.bg,
                  color: item.color,
                }}
              >
                {item.icon}
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 13.5, color: '#64748b' }}>
                  {item.title}
                </Typography>
                <Typography sx={{ mt: 0.25, fontSize: 18, fontWeight: 800, color: item.color }}>
                  {item.value}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Box>

      <Paper sx={{ ...shellPaperSx, overflow: 'hidden' }}>
        <Box sx={{ px: 2.5, py: 2 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, color: '#1e293b' }}>
            Lịch sử điểm
          </Typography>
        </Box>
        <Divider />
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...historyCellSx, fontWeight: 700, color: '#334155' }}>
                  Điểm thay đổi
                </TableCell>
                <TableCell sx={{ ...historyCellSx, fontWeight: 700, color: '#334155' }}>
                  Nội dung
                </TableCell>
                <TableCell sx={{ ...historyCellSx, fontWeight: 700, color: '#334155' }}>
                  Thời gian
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historyRows.length > 0 ? (
                historyRows.map((item) => {
                  const isPositive = Number(item?.changePoint ?? 0) >= 0;

                  return (
                    <TableRow key={item.id ?? `${item.createdAt}-${item.reason}`}>
                      <TableCell
                        sx={{
                          ...historyCellSx,
                          fontWeight: 800,
                          color: isPositive ? '#16a34a' : '#dc2626',
                        }}
                      >
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar
                            sx={{
                              width: 28,
                              height: 28,
                              bgcolor: isPositive
                                ? alpha('#16a34a', 0.12)
                                : alpha('#dc2626', 0.12),
                              color: isPositive ? '#16a34a' : '#dc2626',
                            }}
                          >
                            <TollRounded sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Box component="span">
                            {isPositive ? '+' : ''}
                            {formatNumber(Number(item?.changePoint ?? 0))} Điểm
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell sx={historyCellSx}>{item.reason || 'Chưa có nội dung'}</TableCell>
                      <TableCell sx={historyCellSx}>
                        {new DateFormatter(item.createdAt).format('HH:mm:ss - DD/MM/YYYY')}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    sx={{
                      ...historyCellSx,
                      py: 4,
                      textAlign: 'center',
                      color: '#64748b',
                    }}
                  >
                    Chưa có lịch sử điểm.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  );
};

export default MembershipCard;
