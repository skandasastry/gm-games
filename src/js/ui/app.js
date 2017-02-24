// @flow

/* eslint-disable import/first */
import '../lib/babel-external-helpers';
import Promise from 'bluebird';
import sourceMapSupport from 'source-map-support';
import 'indexeddb-getall-shim';
import 'jquery-ui/sortable';
import page from 'page';
import React from 'react';
import ReactDOM from 'react-dom';
import g from '../globals';
import * as api from './api';
import * as views from './views';
import * as changes from '../data/changes';
import * as account from '../util/account';
import * as ads from '../util/ads';
import bbgmViewReact from '../util/bbgmViewReact';
import * as helpers from '../util/helpers';
import Controller from './components/Controller';

// Needed because of https://github.com/petkaantonov/bluebird/issues/363
// Sadly only enabled in debug mode, due to weird interactions with Bugsnag: https://github.com/bugsnag/bugsnag-js/issues/181
if (localStorage.getItem('debug') === 'debug') {
    sourceMapSupport.install();
}

// Overwrite Promise object globally so Babel uses it when transpiling async/await (not totally sure if necessary)
window.Promise = Promise;
window.Promise.config({warnings: false});

const staticView = (name: string, content: React.Element<*>, inLeague: boolean, title: string) => {
    return bbgmViewReact.init({
        id: name,
        inLeague,
        Component: () => {
            bbgmViewReact.title(title);

            return content;
        },
    });
};

const Manual = <div>
    <h1>Manual</h1>
    <p><a href="https://basketball-gm.com/manual/" rel="noopener noreferrer" target="_blank">Click here for an overview of Basketball GM.</a></p>
</div>;

const leagueView = (id, Component, inLeague = true) => {
    return bbgmViewReact.init({
        id,
        inLeague,
        Component,
    });
};

(async () => {
    await api.init();

    ReactDOM.render(<Controller />, document.getElementById('content'));

    // Any news?
    changes.check();

    /*this.before((ctx) => {
            // Normal Cordova pages
            if (ctx.path.substr(0, 7) === 'file://') {
                ctx.path = ctx.path.substr(7);
            }

            // First load Cordova page
            if (ctx.path.includes('/index.html')) {
                ctx.path = '/';
            }
        }
    });*/

    // Non-league views
    page('/', leagueView('dashboard', views.Dashboard, false));
    page('/new_league', leagueView('newLeague', views.NewLeague, false));
    page('/delete_league/:lid', leagueView('deleteLeague', views.DeleteLeague, false));
    page('/manual', staticView('manual', Manual, false, 'Manual'));
    page('/manual/:page', staticView('manual', Manual, false, 'Manual'));
/*    page('/changes', views.changes.get);
    page('/account', views.account.get);
    page('/account/login_or_register', views.loginOrRegister.get);
    page('/account/lost_password', views.lostPassword.get);
    page('/account/reset_password/:token', views.resetPassword.get);
    page('/account/update_card', views.accountUpdateCard.get);

    // League views
    page('/l/:lid', views.leagueDashboard.get);
    page('/l/:lid/new_team', views.newTeam.get);
    page('/l/:lid/inbox', views.inbox.get);
    page('/l/:lid/message', views.message.get);
    page('/l/:lid/message/:mid', views.message.get);
    page('/l/:lid/standings', views.standings.get);
    page('/l/:lid/standings/:season', views.standings.get);
    page('/l/:lid/playoffs', views.playoffs.get);
    page('/l/:lid/playoffs/:season', views.playoffs.get);
    page('/l/:lid/league_finances', views.leagueFinances.get);
    page('/l/:lid/league_finances/:season', views.leagueFinances.get);
    page('/l/:lid/history', views.history.get);
    page('/l/:lid/history/:season', views.history.get);
    page('/l/:lid/hall_of_fame', views.hallOfFame.get);
    page('/l/:lid/edit_team_info', views.editTeamInfo.get);
    page('/l/:lid/roster', views.roster.get);
    page('/l/:lid/roster/:abbrev', views.roster.get);
    page('/l/:lid/roster/:abbrev/:season', views.roster.get);
    page('/l/:lid/schedule', views.schedule.get);
    page('/l/:lid/schedule/:abbrev', views.schedule.get);
    page('/l/:lid/team_finances', views.teamFinances.get);
    page('/l/:lid/team_finances/:abbrev', views.teamFinances.get);
    page('/l/:lid/team_finances/:abbrev/:show', views.teamFinances.get);
    page('/l/:lid/team_history', views.teamHistory.get);
    page('/l/:lid/team_history/:abbrev', views.teamHistory.get);
    page('/l/:lid/free_agents', views.freeAgents.get);
    page('/l/:lid/trade', views.trade.get);
    page('/l/:lid/trading_block', views.tradingBlock.get);
    page('/l/:lid/draft', views.draft.get);
    page('/l/:lid/draft_summary', views.draftSummary.get);
    page('/l/:lid/draft_summary/:season', views.draftSummary.get);
    page('/l/:lid/game_log', views.gameLog.get);
    page('/l/:lid/game_log/:abbrev', views.gameLog.get);
    page('/l/:lid/game_log/:abbrev/:season', views.gameLog.get);
    page('/l/:lid/game_log/:abbrev/:season/:gid', views.gameLog.get);
    page('/l/:lid/game_log/:abbrev/:season/:gid/:view', views.gameLog.get);
    page('/l/:lid/leaders', views.leaders.get);
    page('/l/:lid/leaders/:season', views.leaders.get);
    page('/l/:lid/player_ratings', views.playerRatings.get);
    page('/l/:lid/player_ratings/:abbrev', views.playerRatings.get);
    page('/l/:lid/player_ratings/:abbrev/:season', views.playerRatings.get);
    page('/l/:lid/player_stats', views.playerStats.get);
    page('/l/:lid/player_stats/:abbrev', views.playerStats.get);
    page('/l/:lid/player_stats/:abbrev/:season', views.playerStats.get);
    page('/l/:lid/player_stats/:abbrev/:season/:statType', views.playerStats.get);
    page('/l/:lid/player_stats/:abbrev/:season/:statType/:playoffs', views.playerStats.get);
    page('/l/:lid/team_stats', views.teamStats.get);
    page('/l/:lid/team_stats/:season', views.teamStats.get);
    page('/l/:lid/player/:pid', views.player.get);
    page('/l/:lid/negotiation', views.negotiationList.get);
    page('/l/:lid/negotiation/:pid', views.negotiation.get);
    page('/l/:lid/player_rating_dists', views.playerRatingDists.get);
    page('/l/:lid/player_rating_dists/:season', views.playerRatingDists.get);
    page('/l/:lid/player_stat_dists', views.playerStatDists.get);
    page('/l/:lid/player_stat_dists/:season', views.playerStatDists.get);
    page('/l/:lid/team_stat_dists', views.teamStatDists.get);
    page('/l/:lid/team_stat_dists/:season', views.teamStatDists.get);
    page('/l/:lid/player_shot_locations', views.playerShotLocations.get);
    page('/l/:lid/player_shot_locations/:season', views.playerShotLocations.get);
    page('/l/:lid/team_shot_locations', views.teamShotLocations.get);
    page('/l/:lid/team_shot_locations/:season', views.teamShotLocations.get);
    page('/l/:lid/export_league', views.exportLeague.get);
    page('/l/:lid/fantasy_draft', views.fantasyDraft.get);
    page('/l/:lid/live', views.live.get);
    page('/l/:lid/live_game', views.liveGame.get);
    page('/l/:lid/event_log', views.eventLog.get);
    page('/l/:lid/event_log/:abbrev', views.eventLog.get);
    page('/l/:lid/event_log/:abbrev/:season', views.eventLog.get);
    page('/l/:lid/delete_old_data', views.deleteOldData.get);
    page('/l/:lid/draft_scouting', views.draftScouting.get);
    page('/l/:lid/draft_scouting/:season', views.draftScouting.get);
    page('/l/:lid/watch_list', views.watchList.get);
    page('/l/:lid/watch_list/:statType', views.watchList.get);
    page('/l/:lid/watch_list/:statType/:playoffs', views.watchList.get);
    page('/l/:lid/customize_player', views.customizePlayer.get);
    page('/l/:lid/customize_player/:pid', views.customizePlayer.get);
    page('/l/:lid/history_all', views.historyAll.get);
    page('/l/:lid/upcoming_free_agents', views.upcomingFreeAgents.get);
    page('/l/:lid/upcoming_free_agents/:season', views.upcomingFreeAgents.get);
    page('/l/:lid/god_mode', views.godMode.get);
    page('/l/:lid/power_rankings', views.powerRankings.get);
    page('/l/:lid/export_stats', views.exportStats.get);
    page('/l/:lid/player_feats', views.playerFeats.get);
    page('/l/:lid/player_feats/:abbrev', views.playerFeats.get);
    page('/l/:lid/player_feats/:abbrev/:season', views.playerFeats.get);
    page('/l/:lid/player_feats/:abbrev/:season/:playoffs', views.playerFeats.get);
    page('/l/:lid/multi_team_mode', views.multiTeamMode.get);
    page('/l/:lid/team_records', views.teamRecords.get);
    page('/l/:lid/team_records/:byType', views.teamRecords.get);
    page('/l/:lid/awards_records', views.awardsRecords.get);
    page('/l/:lid/awards_records/:awardType', views.awardsRecords.get);
    page('/l/:lid/transactions', views.transactions.get);
    page('/l/:lid/transactions/:abbrev', views.transactions.get);
    page('/l/:lid/transactions/:abbrev/:season', views.transactions.get);
    page('/l/:lid/transactions/:abbrev/:season/:eventType', views.transactions.get);*/

    page('*', (ctx, next) => {
        if (!ctx.bbgm || !ctx.bbgm.handled) {
            helpers.error('Page not found.', ctx.bbgm.cb);
            ctx.bbgm.handled = true;
        }
        next();
    });

    // This will run after all the routes defined above, because they all call next()
    let initialLoad = true;
    page('*', (ctx) => {
        if (ctx.bbgm && !ctx.bbgm.noTrack) {
            if (g.enableLogging && window.ga) {
                if (!initialLoad) {
                    window.ga('set', 'page', ctx.path);
                    window.ga('send', 'pageview');
                }
            }

            if (!initialLoad) {
                ads.showBanner();
            } else {
                initialLoad = false;
            }
        }
    });

    page();

    account.check();
})();
