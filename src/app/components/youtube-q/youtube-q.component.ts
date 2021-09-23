import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { I18nService } from "../../services/i18n.service";

const STORAGE_KEY = 'youtube-q';
const YOUTUBE_REGEX = /(youtube\.com\/watch\?.*v=([^&]*)(.*)?)|(youtu\.be\/([^&]*)(.*)?)/
const YOUTUBE_REGEX_ID_CAPTURE = [2, 5];

type Queue = Array<any>;

@Component({
    selector: 'youtube-q',
    templateUrl: './youtube-q.component.html',
    styleUrls: ['./youtube-q.component.scss']
})
export class YoutubeQComponent implements OnInit {
    queue: Queue;
    youtubeq07: string;
    private player;
    private iframeLoaded: boolean = false;
    private playing: boolean = false;

    queueForm = new FormGroup({
        videoControl: new FormControl('', [
            Validators.required,
            Validators.pattern(YOUTUBE_REGEX)
        ])
    })

    get videoControl() { return this.queueForm.get('videoControl') as FormControl; }

    private get savedQueue(): Queue {
        let queue: Queue;
        try {
            let localData = localStorage.getItem(STORAGE_KEY);
            queue = localData? JSON.parse(localData) as Queue : [];
        } catch (e) {
            queue = [];
        }

        return queue;
    }

    private set savedQueue(queue: Queue) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    }

    constructor(private sanitizer: DomSanitizer, private ref: ChangeDetectorRef, private i18nService: I18nService) {}

    public ngOnInit(): void {
        this.i18nService.get('youtubeq07').subscribe(value => this.youtubeq07 = value);
        this.queue = this.savedQueue;

        if (this.queue.length > 0) {
            this.loadIframe();
        }
    }

    public onSubmit(event: Event): void {

        let match = this.videoControl.value.match(YOUTUBE_REGEX);
        
        if (match == null) {
            console.log('Could not parse youtube url');
            return;
        }

        let videoId;
        for (let i = 0; i < YOUTUBE_REGEX_ID_CAPTURE.length; i++) {
            videoId = match[YOUTUBE_REGEX_ID_CAPTURE[i]]
            if (videoId) break;
        }

        if (!videoId) {
            console.log('Could not find a video id');
            return;
        }

        let id: string;
        do {
            id = Math.floor(Math.random() * 9999999999999999).toString();
            while (id.length < 16) {
                id = '0'+id;
            }

        } while (this.queue.find(item => item.id == id))
        

        let newVideo = {
            id: id,
            videoId: videoId,
            url: `https://youtu.be/${videoId}`,
            embed: this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?enablejsapi=1`),
            thumb: `https://img.youtube.com/vi/${videoId}/1.jpg`
        };

        console.log(newVideo);

        this.queue.push(newVideo);
        this.savedQueue = this.queue;

        if (!this.iframeLoaded) this.loadIframe();
        else if (this.queue.length == 1) {
            this.loadCurrentVideo();
        }

        this.queueForm.reset();
    }

    private loadIframe() {
        this.iframeLoaded = true;
        
        let onPlayerReady = (event) => {
            console.log(event);
        };

        let onPlayerStateChange = (event) => {
            let PlayerState = (window as any).YT.PlayerState;

            console.log(event.data);
            console.log(this.playing);
            
            if (event.data == PlayerState.ENDED) {
                this.advanceQueue();
            } else if (event.data == PlayerState.PLAYING) {
                this.playing = true;
            } else if (event.data == PlayerState.PAUSED) {
                this.playing = false;
            }

            this.ref.detectChanges();
        };

        window.setTimeout(() => {
            let tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
    
            let head = document.getElementsByTagName('head')[0];
            head.appendChild(tag);

            (window as any).onYouTubeIframeAPIReady = () => {
                this.player = new (window as any).YT.Player(document.querySelector('.video-container .video'), {
                    videoId: this.queue[0].videoId,
                    events: {
                        onReady: onPlayerReady,
                        onStateChange: onPlayerStateChange
                    }
                });
                console.log(this.player);
                this.ref.detectChanges();
            }
        },1000);
    }

    public clearQueue(): void {
        this.queue = [];
        this.savedQueue = this.queue;
        this.player.stopVideo();
        this.playing = false;
    }

    public playNext(id: string): void {
        let index = this.queue.findIndex(item => item.id == id);
        if (index >= 0 && index != 0 && index != 1) {
            let queueItem = this.queue[index];
            this.queue.splice(index, 1);
            this.queue.splice(1, 0, queueItem);
            this.savedQueue = this.queue;
        }
    }

    public playNow(id: string): void {
        let index = this.queue.findIndex(item => item.id == id);
        if (index >= 0 && index != 0) {
            let queueItem = this.queue[index];
            this.queue.splice(index, 1);
            this.queue.splice(0, 0, queueItem);
            this.savedQueue = this.queue;

            this.playing = true;
            
            this.loadCurrentVideo();
        }
    }

    public moveUp(id: string): void {
        let index = this.queue.findIndex(item => item.id == id);
        if (index > 0) {
            let queueItem = this.queue[index];
            this.queue.splice(index, 1);
            this.queue.splice(index - 1, 0, queueItem);
            this.savedQueue = this.queue;

            if (index == 1) {
                this.loadCurrentVideo();
            }
        }
    }

    public moveDown(id: string): void {
        let index = this.queue.findIndex(item => item.id == id);
        if (index < this.queue.length - 1) {
            let queueItem = this.queue[index];
            this.queue.splice(index, 1);
            this.queue.splice(index + 1, 0, queueItem);
            this.savedQueue = this.queue;

            if (index == 0) {
                this.loadCurrentVideo();
            }
        }
    }

    public deleteItem(id: string): void {
        let index = this.queue.findIndex(item => item.id == id);
        if (index >= 0) {
            this.queue.splice(index, 1);
            this.savedQueue = this.queue;
            if (index == 0 && this.queue.length > 0) {
                this.loadCurrentVideo();
            } else if (this.queue.length == 0) {
                this.player.stopVideo();
                this.playing = false;
            }
        }
    }

    private advanceQueue(): void {
        this.queue.splice(0, 1);
        this.savedQueue = this.queue;
        if (this.queue.length > 0) {
            this.loadCurrentVideo();
        } else {
            this.playing = false;
        }
    }

    private loadCurrentVideo(): void {
        if (!this.playing) {
            this.player.cueVideoById(this.queue[0].videoId);
        } else {
            this.player.loadVideoById(this.queue[0].videoId);
        }
    }
}