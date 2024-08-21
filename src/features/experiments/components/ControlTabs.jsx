import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import CustomTabPanel from './CustomTabPanel';
import TabControlManual from './tabControlManual';
import TabControlRoutine from './tabControlRutina';
import PropTypes from 'prop-types';

export default function ControlTabs({connected, experimentId, availableRobots}) {
  const [value, setValue] = React.useState(0);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="control tabs">
          <Tab label="Control Manual" {...a11yProps(0)} />
          <Tab label="Control Rutina" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <TabControlManual connected={connected} availableRobots={availableRobots}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <TabControlRoutine experimentId={experimentId}/>
      </CustomTabPanel>
    </Box>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

ControlTabs.propTypes = {
  connected: PropTypes.bool.isRequired,
  experimentId: PropTypes.string.isRequired,
  availableRobots: PropTypes.array.isRequired
};