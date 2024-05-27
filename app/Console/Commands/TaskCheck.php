<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Repositories\CheckRepository;
use App\Repositories\TodoRepository;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use App\Services\Slack\SlackFacade as Slack;
use Cmixin\BusinessDay;

class TaskCheck extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tasks:check';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check tasks and send Slack notification if not completed';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        BusinessDay::enable(Carbon::class);
        Carbon::setHolidaysRegion('jp-national');
        $today = Carbon::today();

        if (!$today->isWeekend() && !$today->isHoliday()) {
            $check = CheckRepository::show($today->format('Y-m-d'), 'todo');

            $icons = array('🫠', '😇', '🥲', '🫣', '🙄', '🫨');
            if (!$check || !$check->all_done_at) {
                $message = 'することできてないよ' . $icons[array_rand($icons)];
                if ($check && $check->todos) {
                    foreach ($check->todos as $item) {
                        if (!$item['is_done']) {
                            $todo = TodoRepository::show($item['todo_id']);
                            $message .= "\n- {$todo->name}";
                        }
                    }
                }

                Slack::send($message);

                $this->info('Slack notification sent!');
            } else {
                $this->info('All tasks are completed.');
            }
        }
    }
}
