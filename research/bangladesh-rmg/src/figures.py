"""Publication figures using exactly the same JSON as the website."""
import json
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from acquire import ROOT

def main():
    data=json.loads((ROOT/"outputs/dashboard.json").read_text())
    out=ROOT/"outputs/figures";out.mkdir(exist_ok=True)
    plt.rcParams.update({"font.family":"DejaVu Sans","font.size":10,"axes.spines.top":False,
                         "axes.spines.right":False,"axes.titleweight":"bold","axes.labelcolor":"#334155",
                         "svg.hashsalt":"bangladesh-rmg-v1","figure.facecolor":"white"})
    colors={"Bangladesh":"#087f8c","Vietnam":"#a64b00","Cambodia":"#7c3aed","India":"#64748b","China":"#192f4a"}
    fig,ax=plt.subplots(figsize=(7.2,4.4),layout="constrained")
    for c in ["Bangladesh","Vietnam","Cambodia","India"]:
        r=[x for x in data['annual'] if x['country']==c]
        ax.plot([x['year'] for x in r],[x['share_pct'] for x in r],label=c,color=colors[c],marker='o',markersize=3,lw=2)
    ax.axvline(2013,ymax=.76,color='#94a3b8',ls=':',lw=1)
    ax.text(2013.12,1.2,'Rana Plaza and\nmultiple policy responses',fontsize=8,color='#475569')
    ax.set(ylabel='Share of US apparel import value (%)',xlabel='Calendar year',ylim=(0,20),xticks=list(range(2010,2020,2)))
    ax.grid(axis='y',alpha=.18);ax.legend(frameon=False,ncol=2,loc='upper left')
    for ext in ['png','svg','pdf']:
        meta={'Date':None} if ext=='svg' else ({'CreationDate':None,'ModDate':None} if ext=='pdf' else {})
        fig.savefig(out/f'figure1_market_shares.{ext}',dpi=250,metadata=meta)
    plt.close(fig)
    svg = out / 'figure1_market_shares.svg'
    svg.write_text('\n'.join(line.rstrip() for line in svg.read_text().splitlines()) + '\n')
    fig,axes=plt.subplots(1,2,figsize=(7.2,3.6),layout='constrained')
    r=[x for x in data['annual'] if x['country']=='Bangladesh'];years=[x['year'] for x in r]
    axes[0].stackplot(years,[x['knit_usd']/1e9 for x in r],[x['nonknit_usd']/1e9 for x in r],colors=['#087f8c','#cbd5e1'],labels=['Knit (HS 61)','Non-knit (HS 62)'])
    axes[0].set(ylabel='US import value (current USD billions)',ylim=(0,7),xlabel='Calendar year');axes[0].legend(frameon=False,fontsize=8,loc='upper left')
    axes[1].plot(years,[x['knit_market_share_pct'] for x in r],color='#087f8c',label='Knit (HS 61)',lw=2)
    axes[1].plot(years,[x['nonknit_market_share_pct'] for x in r],color='#334155',label='Non-knit (HS 62)',lw=2)
    axes[1].set(ylabel='Bangladesh share of chapter imports (%)',ylim=(0,14),xlabel='Calendar year');axes[1].legend(frameon=False,fontsize=8,loc='upper left')
    for ax in axes:ax.set_xticks([2010,2013,2016,2019]);ax.grid(axis='y',alpha=.15)
    for ext in ['png','svg','pdf']:
        meta={'Date':None} if ext=='svg' else ({'CreationDate':None,'ModDate':None} if ext=='pdf' else {})
        fig.savefig(out/f'figure2_composition.{ext}',dpi=250,metadata=meta)
    plt.close(fig)
    svg = out / 'figure2_composition.svg'
    svg.write_text('\n'.join(line.rstrip() for line in svg.read_text().splitlines()) + '\n')

if __name__=='__main__':main()
